// Helper functions for parsing experience content
export const parseExperienceContent = (description: string) => {
  const sections = {
    overview: "",
    highlights: [] as string[],
    included: [] as string[],
    notIncluded: [] as string[],
    itinerary: [] as {title: string, description: string}[],
    cancellation: "",
      duration: "",
      languages: "",
    faqs: [] as {question: string, answer: string}[],
    importantInfo: [] as string[]
  };

  // Helper function to process section content
  const processSectionContent = (section: string, content: string[]) => {
    switch (section) {
      case 'overview':
        sections.overview = content.join(' ').trim();
        break;
      case 'highlights':
        sections.highlights = content
          .filter(line => line.startsWith('•'))
          .map(line => line.replace('•', '').trim());
        break;
      case 'included_excluded':
        const includedItems: string[] = [];
        const excludedItems: string[] = [];
        let isExcluded = false;
        
        for (const line of content) {
          if (line.toLowerCase().includes('included:')) {
            isExcluded = false;
            const item = line.replace(/•?\s*included:\s*/i, '').trim();
            if (item) includedItems.push(item);
          } else if (line.toLowerCase().includes('excluded:')) {
            isExcluded = true;
            const item = line.replace(/•?\s*excluded:\s*/i, '').trim();
            if (item) excludedItems.push(item);
          } else if (line.startsWith('•')) {
            const item = line.replace('•', '').trim();
            if (isExcluded) {
              excludedItems.push(item);
            } else {
              includedItems.push(item);
            }
          }
        }
        
        sections.included = includedItems;
        sections.notIncluded = excludedItems;
        break;
      case 'what_to_expect':
        let currentSubsection = '';
        const itineraryItems: {title: string, description: string}[] = [];
        let cancellationPolicy = '';
        
        for (const line of content) {
          if (line.toLowerCase() === 'itinerary') {
            currentSubsection = 'itinerary';
          } else if (line.toLowerCase().includes('cancellation policy')) {
            currentSubsection = 'cancellation';
          } else if (line.startsWith('•') && currentSubsection === 'itinerary') {
            const item = line.replace('•', '').trim();
            // Create a structured itinerary item
            itineraryItems.push({
              title: `Step ${itineraryItems.length + 1}`,
              description: item
            });
          } else if (line.startsWith('•') && currentSubsection === 'cancellation') {
            const item = line.replace('•', '').trim();
            cancellationPolicy = item;
          }
        }
        
        sections.itinerary = itineraryItems;
        sections.cancellation = cancellationPolicy;
        break;
      case 'languages':
        sections.languages = content.join(' ').trim();
        break;
      case 'faqs':
        const faqItems: {question: string, answer: string}[] = [];
        let currentQuestion = '';
        let currentAnswer = '';
        
        for (const line of content) {
          if (line.endsWith('?')) {
            // If we have a previous Q&A pair, save it
            if (currentQuestion && currentAnswer) {
              faqItems.push({ question: currentQuestion, answer: currentAnswer.trim() });
            }
            currentQuestion = line;
            currentAnswer = '';
          } else if (currentQuestion && line.trim()) {
            currentAnswer += line + ' ';
          }
        }
        
        // Don't forget the last Q&A pair
        if (currentQuestion && currentAnswer) {
          faqItems.push({ question: currentQuestion, answer: currentAnswer.trim() });
        }
        
        sections.faqs = faqItems;
        break;
      case 'important':
        sections.importantInfo = content
          .filter(line => line.startsWith('•') || line.trim())
          .map(line => line.replace('•', '').trim());
        break;
    }
  };

  // Split description by sections and parse
  const lines = description.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine === 'Overview') {
      if (currentSection && currentContent.length > 0) {
        processSectionContent(currentSection, currentContent);
      }
      currentSection = 'overview';
      currentContent = [];
    } else if (trimmedLine === 'Highlights') {
      if (currentSection && currentContent.length > 0) {
        processSectionContent(currentSection, currentContent);
      }
      currentSection = 'highlights';
      currentContent = [];
    } else if (trimmedLine === 'Included/Excluded') {
      if (currentSection && currentContent.length > 0) {
        processSectionContent(currentSection, currentContent);
      }
      currentSection = 'included_excluded';
      currentContent = [];
    } else if (trimmedLine.includes('What to Expect')) {
      if (currentSection && currentContent.length > 0) {
        processSectionContent(currentSection, currentContent);
      }
      currentSection = 'what_to_expect';
      currentContent = [];
    } else if (trimmedLine === 'Language') {
      if (currentSection && currentContent.length > 0) {
        processSectionContent(currentSection, currentContent);
      }
      currentSection = 'languages';
      currentContent = [];
    } else if (trimmedLine.includes('Frequently Asked Questions')) {
      if (currentSection && currentContent.length > 0) {
        processSectionContent(currentSection, currentContent);
      }
      currentSection = 'faqs';
      currentContent = [];
    } else if (trimmedLine === 'Important Information') {
      if (currentSection && currentContent.length > 0) {
        processSectionContent(currentSection, currentContent);
      }
      currentSection = 'important';
      currentContent = [];
    } else if (trimmedLine && !trimmedLine.startsWith('Where You\'ll Be')) {
      if (currentSection) {
        currentContent.push(trimmedLine);
      }
    }
  }

  // Process final section
  if (currentSection && currentContent.length > 0) {
    processSectionContent(currentSection, currentContent);
  }

  // Default fallback parsing if no specific content found
  if (!sections.overview) {
    sections.overview = description.split('\n')[0] || "Discover this unique conservation experience";
    sections.highlights = [
      "Immersive conservation experience with expert guides",
      "Direct contribution to wildlife and community protection", 
      "Authentic cultural exchange with local communities"
    ];
    sections.included = ["Professional guide", "Conservation activities"];
    sections.notIncluded = ["Transportation", "Personal expenses", "Insurance"];
    sections.languages = "English";
  }

  return sections;
};