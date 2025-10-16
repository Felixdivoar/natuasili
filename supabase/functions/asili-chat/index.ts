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

// Experience Index Cache
let experienceIndex: any[] = [];
let indexLastUpdated = 0;
const INDEX_REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours
const brokenLinks: any[] = [];

// Manual overrides for critical experiences (canonical slugs)
const EXPERIENCE_OVERRIDES: Record<string, string> = {
  'reteti elephant sanctuary': 'reteti-community-elephant-experience',
  'reteti elephant': 'reteti-community-elephant-experience',
  'reteti': 'reteti-community-elephant-experience',
  'mara elephant project': 'elephant-researcher-mara-elephant-project',
  'mara elephant': 'elephant-researcher-mara-elephant-project',
  'ruko giraffe sanctuary': 'giraffe-at-ruko-sanctuary',
  'ruko giraffe': 'giraffe-at-ruko-sanctuary',
  'ruko': 'giraffe-at-ruko-sanctuary',
  'ol pejeta rhino': 'meet-northern-white-rhinos-ol-pejeta',
  'northern white rhino': 'meet-northern-white-rhinos-ol-pejeta',
  'ol pejeta': 'meet-northern-white-rhinos-ol-pejeta',
  'giraffe centre nairobi': 'meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew',
  'giraffe nairobi': 'meet-rothschild-giraffes-at-giraffe-nairobi-centre-with-afew',
  'colobus conservation': 'colobus-conservation-guided-eco-tours',
  'colobus monkey': 'colobus-conservation-guided-eco-tours',
  'watamu ocean': 'ocean-conservation-day-watamu',
  'coral conservation': 'dive-into-coral-conservation-with-reefolution',
  'reef diving': 'dive-into-coral-conservation-with-reefolution',
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

const SYSTEM_PROMPT = `You are AsiliChat, a proactive conservation assistant for Kenya. Guide travelers to authentic bookable experiences.

Your role:
- PROACTIVELY suggest 2-4 specific experiences when users show interest
- Highlight conservation impact in every recommendation
- Be warm, concise, action-oriented (under 80 words)
- Let experience cards do the detailed talking

When recommending experiences:
- Focus on unique value ("Support elephant orphans", "Track wild rhinos")
- Include clear CTAs: "Book now" or "Learn more"
- Mention themes for exploration (Elephants, Marine, Community, Forest)

For booking inquiries:
- Show relevant experience cards immediately
- Explain: "Pick dates, add to cart, enter details at checkout"
- Offer WhatsApp for complex requests

Keep it conversational and conservation-forward!`;

type ToolResult = { name: string; data: any };

// Build experience index from database
async function buildExperienceIndex(): Promise<void> {
  const now = Date.now();
  if (experienceIndex.length > 0 && now - indexLastUpdated < INDEX_REFRESH_INTERVAL) {
    return; // Use cached index
  }

  console.log('Building experience index...');
  
  const { data, error } = await supabase
    .from('experiences')
    .select('id, slug, title, description, location_text, themes, categories, price_kes_adult, hero_image, duration_hours')
    .eq('visible_on_marketplace', true);

  if (error) {
    console.error('Error fetching experiences:', error);
    return;
  }

  experienceIndex = data || [];
  indexLastUpdated = now;
  console.log(`✓ Index built with ${experienceIndex.length} experiences`);
}

// Validate URL (lightweight check)
async function validateUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    return response.status === 200;
  } catch (error) {
    console.error(`URL validation failed for ${url}:`, error);
    return false;
  }
}

// Get validated absolute URL
async function getValidatedUrl(slug: string): Promise<string> {
  const url = `${BASE_URL}/experiences/${slug}`;
  
  // Skip validation for now to improve performance
  // In production, you might want to enable this with caching
  return url;
  
  /* Uncomment for strict validation:
  const isValid = await validateUrl(url);
  
  if (!isValid) {
    console.warn(`⚠️ Invalid URL: ${url}, using fallback`);
    brokenLinks.push({ slug, url, timestamp: new Date().toISOString() });
    return `${BASE_URL}${FALLBACK_CATEGORY}`;
  }
  
  return url;
  */
}

// Detect intent from user message
function detectIntent(message: string): string[] {
  const msg = message.toLowerCase();
  const intents: string[] = [];
  
  if (/(book|reserve|schedule|plan|trip|visit|go to|take me)/i.test(msg)) intents.push('book');
  if (/(learn|tell me|what|info|about|explain)/i.test(msg)) intents.push('learn');
  if (/(price|cost|how much|expensive|cheap)/i.test(msg)) intents.push('pricing');
  if (/(volunteer|help out|contribute|work)/i.test(msg)) intents.push('volunteer');
  if (/(donate|donation|support|give)/i.test(msg)) intents.push('donate');
  
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

// Tool: Proactive experience search with validation
async function tool_experienceSearch(q: string, entities: any): Promise<ToolResult> {
  await buildExperienceIndex();
  
  const results = searchExperiences(q, entities);
  
  // Enrich with absolute URLs
  const enriched = await Promise.all(
    results.map(async (exp) => ({
      ...exp,
      url: await getValidatedUrl(exp.slug),
      bookUrl: await getValidatedUrl(exp.slug),
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
    
    // Build/refresh experience index
    await buildExperienceIndex();

    // Detect intent and entities
    const intents = detectIntent(userMessage);
    const entities = detectEntities(userMessage);
    
    console.log(`Intent: [${intents.join(', ')}] | Entities: themes=[${entities.themes.join(', ')}], locations=[${entities.locations.join(', ')}]`);

    const tools: ToolResult[] = [];

    // PROACTIVE: Always search experiences if booking intent OR entities detected
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
