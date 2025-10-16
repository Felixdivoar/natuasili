import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Environment configuration
const BASE_URL = Deno.env.get('BASE_URL') || 'https://preview--natuasili.lovable.app';
const FALLBACK_CATEGORY = '/experiences';

// Site Index Cache (comprehensive)
let siteIndex: any[] = [];
let experienceIndex: any[] = [];
let indexLastUpdated = 0;
const INDEX_REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
const brokenLinks: any[] = [];
const linkCache: Map<string, { url: string; valid: boolean; timestamp: number }> = new Map();
const LINK_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Static site pages (canonical URLs)
const STATIC_PAGES: Record<string, string> = {
  'about': '/about',
  'about asili': '/about',
  'about us': '/about',
  'who we are': '/about',
  'contact': '/contact',
  'contact us': '/contact',
  'get in touch': '/contact',
  'whatsapp': '/contact',
  'impact': '/impact',
  'how it works': '/impact',
  'our impact': '/impact',
  'donate': '/donate',
  'donation': '/donate',
  'support': '/donate',
  'give': '/donate',
  'partners': '/partners',
  'partner': '/partners',
  'organizations': '/partners',
  'faq': '/faq',
  'help': '/faq',
  'questions': '/faq',
  'privacy': '/privacy',
  'privacy policy': '/privacy',
  'terms': '/terms',
  'terms and conditions': '/terms',
  'refund': '/terms',
  'experiences': '/experiences',
  'all experiences': '/experiences',
  'themes': '/themes',
};

// Theme pages
const THEME_PAGES: Record<string, string> = {
  'elephants': '/themes/elephants',
  'elephant': '/themes/elephants',
  'marine': '/themes/marine',
  'ocean': '/themes/marine',
  'sea': '/themes/marine',
  'coral': '/themes/marine',
  'community': '/themes/community',
  'cultural': '/themes/community',
  'village': '/themes/community',
  'birds': '/themes/birds',
  'birding': '/themes/birds',
  'forest': '/themes/forest',
  'trees': '/themes/forest',
  'giraffes': '/themes/giraffes',
  'giraffe': '/themes/giraffes',
  'rhinos': '/themes/rhinos',
  'rhino': '/themes/rhinos',
};

// Manual overrides for critical experiences (canonical slugs)
const EXPERIENCE_OVERRIDES: Record<string, string> = {
  'reteti elephant sanctuary': 'reteti-community-elephant-experience',
  'reteti elephant': 'reteti-community-elephant-experience',
  'reteti': 'reteti-community-elephant-experience',
  'retheti': 'reteti-community-elephant-experience',
  'mara elephant project': 'elephant-researcher-mara-elephant-project',
  'mara elephant': 'elephant-researcher-mara-elephant-project',
  'mep': 'elephant-researcher-mara-elephant-project',
  'ruko giraffe sanctuary': 'giraffe-at-ruko-sanctuary',
  'ruko giraffe': 'giraffe-at-ruko-sanctuary',
  'ruko': 'giraffe-at-ruko-sanctuary',
  'ol pejeta rhino': 'meet-northern-white-rhinos-ol-pejeta',
  'northern white rhino': 'meet-northern-white-rhinos-ol-pejeta',
  'ol pejeta': 'meet-northern-white-rhinos-ol-pejeta',
  'olpejeta': 'meet-northern-white-rhinos-ol-pejeta',
  'giraffe centre nairobi': 'meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew',
  'giraffe nairobi': 'meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew',
  'giraffe center': 'meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew',
  'colobus conservation': 'colobus-conservation-guided-eco-tours',
  'colobus monkey': 'colobus-conservation-guided-eco-tours',
  'watamu ocean': 'ocean-conservation-day-watamu',
  'coral conservation': 'dive-into-coral-conservation-with-reefolution',
  'reef diving': 'dive-into-coral-conservation-with-reefolution',
  'reefolution': 'dive-into-coral-conservation-with-reefolution',
  'karura forest': 'karura-forest-specialized-eco-tours',
  'nairobi park': 'citizen-scientist-nairobi-park',
  'drone conservation': 'drone-conservation-mara-elephant',
};

// Entity keywords for matching
const ENTITY_KEYWORDS: Record<string, string[]> = {
  'elephants': ['elephant', 'elephants', 'tusker', 'jumbo', 'reteti', 'mara elephant', 'pachyderm'],
  'giraffes': ['giraffe', 'giraffes', 'rothschild', 'ruko'],
  'rhinos': ['rhino', 'rhinos', 'rhinoceros', 'white rhino', 'black rhino', 'ol pejeta'],
  'marine': ['marine', 'ocean', 'coral', 'reef', 'sea', 'dive', 'snorkel', 'watamu', 'diani', 'coast', 'coastal'],
  'community': ['community', 'cultural', 'village', 'traditional', 'homestay', 'koija', 'local'],
  'birds': ['bird', 'birds', 'birding', 'birdwatching', 'ornithology', 'avian'],
  'forest': ['forest', 'tree', 'trees', 'woodland', 'karura', 'nature walk'],
  'conservation': ['conservation', 'protect', 'sanctuary', 'conservancy', 'wildlife'],
};

const SYSTEM_PROMPT = `You are AsiliChat, a smart, fast concierge for NatuAsili—Kenya's conservation marketplace.

Your role:
- Help users navigate ANYWHERE on the site (experiences, themes, about, partners, FAQs, policies, donate, contact)
- Answer questions about conservation, bookings, impact, volunteering
- PROACTIVELY suggest 2-4 relevant options with working links
- Be warm, concise, action-oriented (under 80 words)

When users ask:
- "about" / "who are you" → About page
- "contact" / "help" → Contact page
- "privacy" / "terms" → Policy pages
- "donate" / "support" → Donate page
- "partners" → Partners page
- "impact" / "how it works" → Impact page
- Species/themes → Relevant experiences + theme pages
- General browsing → Popular experiences and themes

For bookings:
- Show experience cards with "Book now" links
- Explain: "Pick dates, add to cart, checkout"
- Offer WhatsApp for complex requests

Keep responses concise, helpful, and conservation-forward!`;

type ToolResult = { name: string; data: any };

// Build comprehensive site index
async function buildSiteIndex(): Promise<void> {
  const now = Date.now();
  if (siteIndex.length > 0 && experienceIndex.length > 0 && now - indexLastUpdated < INDEX_REFRESH_INTERVAL) {
    return; // Use cached index
  }

  console.log('Building site index...');
  
  // Fetch experiences
  const { data: expData, error: expError } = await supabase
    .from('experiences')
    .select('id, slug, title, description, location_text, themes, categories, price_kes_adult, hero_image, duration_hours')
    .eq('visible_on_marketplace', true);

  if (expError) {
    console.error('Error fetching experiences:', expError);
  } else {
    experienceIndex = expData || [];
  }

  // Build static pages index
  const staticPagesIndex = Object.entries(STATIC_PAGES).map(([key, url]) => ({
    type: 'page',
    title: key.charAt(0).toUpperCase() + key.slice(1),
    url,
    keywords: key.split(' '),
  }));

  // Build theme pages index
  const themePagesIndex = Object.entries(THEME_PAGES).map(([key, url]) => ({
    type: 'theme',
    title: key.charAt(0).toUpperCase() + key.slice(1),
    url,
    keywords: key.split(' '),
  }));

  // Combine all indexes
  siteIndex = [...staticPagesIndex, ...themePagesIndex];
  indexLastUpdated = now;
  
  console.log(`✓ Site index built: ${experienceIndex.length} experiences, ${siteIndex.length} pages/themes`);
}

// Validate URL with caching (lightweight check)
async function validateUrl(url: string): Promise<boolean> {
  // Check cache first
  const cached = linkCache.get(url);
  if (cached && Date.now() - cached.timestamp < LINK_CACHE_TTL) {
    return cached.valid;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    const isValid = response.status === 200;
    
    // Cache result
    linkCache.set(url, { url, valid: isValid, timestamp: Date.now() });
    
    return isValid;
  } catch (error) {
    console.error(`URL validation failed for ${url}:`, error);
    
    // Cache as invalid
    linkCache.set(url, { url, valid: false, timestamp: Date.now() });
    
    return false;
  }
}

// Get validated absolute URL (with intelligent fallback)
async function getValidatedUrl(slug: string, type: 'experience' | 'page' | 'theme' = 'experience'): Promise<string> {
  let url: string;
  
  if (type === 'page') {
    url = `${BASE_URL}${slug}`;
  } else if (type === 'theme') {
    url = `${BASE_URL}${slug}`;
  } else {
    url = `${BASE_URL}/experiences/${slug}`;
  }
  
  // Validate with caching
  const isValid = await validateUrl(url);
  
  if (!isValid) {
    console.warn(`⚠️ Invalid URL: ${url}, using fallback`);
    brokenLinks.push({ slug, url, timestamp: new Date().toISOString(), type });
    
    // Intelligent fallback based on type
    if (type === 'theme') {
      return `${BASE_URL}/themes`;
    } else if (type === 'page') {
      return `${BASE_URL}`;
    } else {
      return `${BASE_URL}${FALLBACK_CATEGORY}`;
    }
  }
  
  return url;
}

// Detect intent from user message (expanded for full-site navigation)
function detectIntent(message: string): string[] {
  const msg = message.toLowerCase();
  const intents: string[] = [];
  
  // Navigation intents
  if (/(about|who are you|who|what is asili)/i.test(msg)) intents.push('about');
  if (/(contact|reach|talk|whatsapp|phone|email|get in touch)/i.test(msg)) intents.push('contact');
  if (/(privacy|policy|policies|terms|conditions|refund)/i.test(msg)) intents.push('policy');
  if (/(faq|help|question|how do)/i.test(msg)) intents.push('help');
  if (/(partner|partners|organization|who runs)/i.test(msg)) intents.push('partners');
  if (/(impact|how it works|donation.*work|where.*money)/i.test(msg)) intents.push('impact');
  
  // Action intents
  if (/(book|reserve|schedule|plan|trip|visit|go to|take me)/i.test(msg)) intents.push('book');
  if (/(donate|donation|support|give|contribute money)/i.test(msg)) intents.push('donate');
  if (/(volunteer|help out|work|behind the scenes)/i.test(msg)) intents.push('volunteer');
  
  // Information intents
  if (/(learn|tell me|what|info|explain)/i.test(msg)) intents.push('learn');
  if (/(price|cost|how much|expensive|cheap|pricing)/i.test(msg)) intents.push('pricing');
  if (/(compare|difference|versus|vs|which)/i.test(msg)) intents.push('compare');
  
  // Theme browsing
  if (/(theme|category|type|kind)/i.test(msg)) intents.push('browse');
  
  return intents.length > 0 ? intents : ['learn'];
}

// Detect entities (species, locations, themes)
function detectEntities(message: string): { themes: string[], locations: string[] } {
  const msg = message.toLowerCase();
  const detected = { themes: [] as string[], locations: [] as string[] };
  
  // Check entity keywords
  for (const [theme, keywords] of Object.entries(ENTITY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (msg.includes(keyword.toLowerCase())) {
        if (!detected.themes.includes(theme)) {
          detected.themes.push(theme);
        }
        break;
      }
    }
  }
  
  // Location detection
  const locations = [
    'samburu', 'laikipia', 'mara', 'masai mara', 'maasai mara', 
    'nairobi', 'coast', 'coastal', 'diani', 'watamu', 'ol pejeta', 
    'karen', 'karura'
  ];
  
  for (const loc of locations) {
    if (msg.includes(loc)) {
      if (!detected.locations.includes(loc)) {
        detected.locations.push(loc);
      }
    }
  }
  
  return detected;
}

// Search experiences with intelligent ranking
function searchExperiences(query: string, entities: any, limit = 4): any[] {
  const msg = query.toLowerCase();
  
  // Check for manual overrides first (highest priority)
  for (const [key, slug] of Object.entries(EXPERIENCE_OVERRIDES)) {
    if (msg.includes(key.toLowerCase())) {
      const exp = experienceIndex.find(e => e.slug === slug);
      if (exp) {
        console.log(`✓ Override match: "${key}" → ${slug}`);
        // Return this as first result, then add others
        const others = experienceIndex.filter(e => e.slug !== slug).slice(0, limit - 1);
        return [exp, ...others];
      }
    }
  }
  
  // Score-based ranking
  const scored = experienceIndex.map(exp => {
    let score = 0;
    const expText = `${exp.title} ${exp.description} ${exp.location_text}`.toLowerCase();
    const themesText = JSON.stringify(exp.themes || []).toLowerCase();
    
    // Theme match (highest priority: +50 per match)
    for (const theme of entities.themes) {
      if (expText.includes(theme) || themesText.includes(theme)) {
        score += 50;
      }
    }
    
    // Location match (+30 per match)
    for (const loc of entities.locations) {
      if (expText.includes(loc)) {
        score += 30;
      }
    }
    
    // Keyword match (+10 per significant keyword)
    const keywords = msg.split(/\s+/).filter(w => w.length > 3);
    for (const kw of keywords) {
      if (expText.includes(kw)) {
        score += 10;
      }
    }
    
    return { ...exp, score };
  });
  
  const results = scored
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  console.log(`✓ Ranked ${results.length} experiences (top score: ${results[0]?.score || 0})`);
  return results;
}

// Tool: Search site pages (static pages, themes, etc.)
async function tool_pageSearch(q: string, intents: string[]): Promise<ToolResult> {
  await buildSiteIndex();
  
  const msg = q.toLowerCase();
  const results: any[] = [];
  
  // Check static pages first
  for (const [key, url] of Object.entries(STATIC_PAGES)) {
    if (msg.includes(key) || intents.some(intent => key.includes(intent))) {
      results.push({
        type: 'page',
        title: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
        url: await getValidatedUrl(url, 'page'),
        description: `Learn more about ${key}`,
      });
      if (results.length >= 3) break;
    }
  }
  
  // Check theme pages
  if (results.length < 3) {
    for (const [key, url] of Object.entries(THEME_PAGES)) {
      if (msg.includes(key)) {
        results.push({
          type: 'theme',
          title: key.charAt(0).toUpperCase() + key.slice(1) + ' Experiences',
          url: await getValidatedUrl(url, 'theme'),
          description: `Explore all ${key} conservation experiences`,
        });
        if (results.length >= 3) break;
      }
    }
  }
  
  console.log(`✓ Page search: "${q}" → ${results.length} results`);
  return { name: 'pageSearch', data: results };
}

// Tool: Proactive experience search with validation
async function tool_experienceSearch(q: string, entities: any): Promise<ToolResult> {
  await buildSiteIndex();
  
  const results = searchExperiences(q, entities);
  
  // Enrich with absolute URLs
  const enriched = await Promise.all(
    results.map(async (exp) => ({
      ...exp,
      url: await getValidatedUrl(exp.slug, 'experience'),
      bookUrl: await getValidatedUrl(exp.slug, 'experience'),
    }))
  );
  
  console.log(`✓ Experience search: "${q}" → ${enriched.length} results`);
  return { name: 'experienceSearch', data: enriched };
}

// Tool: Species lookup
async function tool_speciesLookup(q: string): Promise<ToolResult> {
  try {
    const { data, error } = await supabase.rpc("fts_species_lookup", { q });
    if (error) throw error;
    console.log(`✓ Species lookup: "${q}" → ${data?.length || 0} results`);
    return { name: "speciesLookup", data: data || [] };
  } catch (error) {
    console.error("Species lookup error:", error);
    return { name: "speciesLookup", data: [] };
  }
}

// Tool: Partner facts
async function tool_partnerFacts(q: string): Promise<ToolResult> {
  try {
    const { data, error } = await supabase
      .from("partner_profiles")
      .select("org_name, bio, location")
      .or(`org_name.ilike.%${q}%, bio.ilike.%${q}%, location.ilike.%${q}%`)
      .eq("kyc_status", "approved")
      .limit(5);
    
    if (error) throw error;
    console.log(`✓ Partner facts: "${q}" → ${data?.length || 0} results`);
    return { name: "partnerFacts", data: data || [] };
  } catch (error) {
    console.error("Partner facts error:", error);
    return { name: "partnerFacts", data: [] };
  }
}

// Tool: Carbon estimation
async function tool_tripCarbon(q: string): Promise<ToolResult> {
  const domesticFlight = q.toLowerCase().includes("flight") || q.toLowerCase().includes("fly");
  const roadTrip = q.toLowerCase().includes("drive") || q.toLowerCase().includes("road");
  
  let estimate = 0.01;
  if (domesticFlight) estimate = 0.15;
  else if (roadTrip) estimate = 0.03;
  
  return { 
    name: "tripCarbon", 
    data: { 
      hint: "rough_estimate", 
      factor: estimate,
      advice: domesticFlight ? "Consider overland alternatives or carbon offsets" : 
              roadTrip ? "Shared transport reduces per-person impact" :
              "Walking safaris and local guides minimize footprint"
    } 
  };
}

// Generate AI response
async function generateResponse(userMessage: string, tools: ToolResult[]): Promise<{ answer: string, suggestions: string[] }> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  // Enhanced fallback with experience-first approach
  if (!openAIApiKey) {
    const experienceData = tools.find(t => t.name === "experienceSearch")?.data || [];
    const speciesData = tools.find(t => t.name === "speciesLookup")?.data || [];
    const partnerData = tools.find(t => t.name === "partnerFacts")?.data || [];
    
    let answer = "";
    let suggestions: string[] = [];
    
    if (experienceData.length > 0) {
      const exp = experienceData[0];
      answer = `Check out "${exp.title}" in ${exp.location_text}! ${exp.description.substring(0, 120)}... Duration: ${exp.duration_hours}h | Price: KES ${exp.price_kes_adult.toLocaleString()}/adult. Ready to book?`;
      suggestions = [
        "Show more like this",
        "What's the booking process?",
        "Tell me about conservation impact"
      ];
    } else if (speciesData.length > 0) {
      const species = speciesData[0];
      answer = `${species.common_name} (${species.scientific_name}): ${species.notes?.substring(0, 150) || 'Fascinating species!'}`;
      suggestions = ["Where can I see them?", "Best viewing season", "Conservation status"];
    } else if (partnerData.length > 0) {
      const partner = partnerData[0];
      answer = `${partner.org_name} in ${partner.location}: ${partner.bio?.substring(0, 150)}`;
      suggestions = ["Visit their experiences", "How to support", "Other partners"];
    } else {
      answer = "I can help you discover amazing conservation experiences in Kenya! Try asking about elephants, marine life, community projects, or specific locations like Samburu or Nairobi.";
      suggestions = ["Book an elephant experience", "Marine conservation activities", "Community cultural visits"];
    }
    
    return { answer, suggestions };
  }
  
  // Use OpenAI for rich responses
  try {
    let toolContext = "";
    if (tools.length > 0) {
      toolContext = "\n\nContext from tools:\n" + 
        tools.map(tool => `${tool.name}: ${JSON.stringify(tool.data, null, 2)}`).join("\n");
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage + toolContext }
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const answer = data.choices[0].message.content;
    
    // Generate contextual suggestions
    const suggestions = [];
    const experienceData = tools.find(t => t.name === "experienceSearch")?.data || [];
    
    if (experienceData.length > 0) {
      suggestions.push("View booking details", "More experiences like this", "Explore themes");
    } else if (userMessage.toLowerCase().includes('book') || userMessage.toLowerCase().includes('trip')) {
      suggestions.push("Elephant experiences", "Marine conservation", "Community visits");
    } else {
      suggestions.push("What can I book?", "Best parks to visit", "Conservation volunteering");
    }
    
    return { answer, suggestions: suggestions.slice(0, 3) };
    
  } catch (error) {
    console.error('OpenAI error:', error);
    return {
      answer: "I'm here to help! Ask me about elephants, marine life, community projects, or booking experiences.",
      suggestions: ["Book elephant experience", "Marine conservation", "Cultural visits"]
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const body = await req.json();
    const userMessage: string = body?.message ?? "";
    const userId: string = body?.userId ?? null;
    
    if (!userMessage.trim()) {
      return new Response(JSON.stringify({ 
        error: "No message provided" 
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`\n🔷 Processing: "${userMessage}"`);
    
    // Build/refresh site index
    await buildSiteIndex();

    // Detect intent and entities
    const intents = detectIntent(userMessage);
    const entities = detectEntities(userMessage);
    
    console.log(`Intent: [${intents.join(', ')}] | Entities: themes=[${entities.themes.join(', ')}], locations=[${entities.locations.join(', ')}]`);

    const tools: ToolResult[] = [];

    // NAVIGATION: Check for page/theme navigation intents first
    const navIntents = ['about', 'contact', 'policy', 'help', 'partners', 'impact', 'donate'];
    if (intents.some(intent => navIntents.includes(intent))) {
      const pageRes = await tool_pageSearch(userMessage, intents);
      tools.push(pageRes);
    }

    // PROACTIVE: Search experiences if booking intent OR entities detected
    const shouldSearchExperiences = 
      intents.includes('book') || 
      entities.themes.length > 0 || 
      entities.locations.length > 0 ||
      /\b(experience|safari|tour|activity|visit|see|do)\b/i.test(userMessage);

    if (shouldSearchExperiences) {
      const expRes = await tool_experienceSearch(userMessage, entities);
      tools.push(expRes);
    }

    // Species lookup
    if (/\b(elephant|lion|rhino|giraffe|leopard|cheetah|buffalo|zebra|wildlife|animal|species)\b/i.test(userMessage)) {
      const speciesRes = await tool_speciesLookup(userMessage);
      tools.push(speciesRes);
    }

    // Partner info
    if (/\b(partner|organization|org|ngo|who runs|who manages)\b/i.test(userMessage)) {
      const partnerRes = await tool_partnerFacts(userMessage);
      tools.push(partnerRes);
    }

    // Carbon estimation
    if (/\b(carbon|emission|footprint|climate|offset)\b/i.test(userMessage)) {
      const carbonRes = await tool_tripCarbon(userMessage);
      tools.push(carbonRes);
    }

    // Generate response
    const { answer, suggestions } = await generateResponse(userMessage, tools);
    
    // Log conversation
    if (userId) {
      try {
        await supabase.from('chat_logs').insert({
          user_id: userId,
          query: userMessage,
          response: answer
        });
      } catch (logError) {
        console.error('Failed to log conversation:', logError);
      }
    }
    
    console.log(`✓ Response generated with ${tools.length} tools, ${suggestions.length} suggestions\n`);
    
    // Log cache stats periodically
    if (linkCache.size > 0) {
      console.log(`📊 Link cache: ${linkCache.size} entries`);
    }
    
    return new Response(JSON.stringify({
      answer,
      tools,
      suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ AsiliChat error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      answer: "I'm experiencing technical difficulties. Please try asking about elephants, marine life, or booking experiences!",
      suggestions: ["Elephant experiences", "Marine conservation", "Best parks"]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
