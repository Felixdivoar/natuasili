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

const SYSTEM_PROMPT = `You are AsiliChat, a conservation assistant focused on Kenya.
Always prioritize: Kenyan species facts, habitats, protected areas, seasons, ethics, community conservation, and low-impact travel guidance.
Be concise, practical, and cite source types (e.g., "KWS factsheet", "partner page data").

When recommending experiences:
- Highlight conservation impact and community benefits
- Mention price range and duration
- Explain what makes each experience unique
- Encourage sustainable and ethical tourism practices

If the user expresses interest in booking, guide them through these steps:
1. Help them choose the right experience based on their interests
2. Explain what to expect (duration, activities, location)
3. Mention they'll need to provide booking details (date, number of people)
4. Let them know personal information will be collected at checkout

Offer up to 3 short follow-up suggestions tailored to the last user message.
Default language: English; accept Swahili phrases. Keep tone warm, factual, and non-political.
If unsure, ask one clarifying question before proceeding.`;

type ToolResult = { name: string; data: any };

async function tool_speciesLookup(q: string): Promise<ToolResult> {
  try {
    const { data, error } = await supabase.rpc("fts_species_lookup", { q });
    if (error) throw error;
    return { name: "speciesLookup", data: data || [] };
  } catch (error) {
    console.error("Species lookup error:", error);
    return { name: "speciesLookup", data: [] };
  }
}

async function tool_partnerFacts(q: string): Promise<ToolResult> {
  try {
    const { data, error } = await supabase
      .from("partner_profiles")
      .select("org_name, bio, location")
      .or(`org_name.ilike.%${q}%, bio.ilike.%${q}%, location.ilike.%${q}%`)
      .eq("kyc_status", "approved")
      .limit(5);
    
    if (error) throw error;
    return { name: "partnerFacts", data: data || [] };
  } catch (error) {
    console.error("Partner facts error:", error);
    return { name: "partnerFacts", data: [] };
  }
}

async function tool_experienceSearch(q: string): Promise<ToolResult> {
  try {
    const messageLower = q.toLowerCase();
    
    // Build query based on user intent
    let query = supabase
      .from("experiences")
      .select("id, slug, title, description, price_kes_adult, location_text, hero_image, themes, categories, duration_hours")
      .eq("visible_on_marketplace", true);
    
    // Filter by themes/categories
    if (messageLower.includes("wildlife") || messageLower.includes("safari")) {
      query = query.contains("themes", ["Wildlife Conservation"]);
    } else if (messageLower.includes("marine") || messageLower.includes("ocean") || messageLower.includes("coast")) {
      query = query.contains("themes", ["Marine Conservation"]);
    } else if (messageLower.includes("community") || messageLower.includes("cultural")) {
      query = query.contains("themes", ["Community Tourism"]);
    } else if (messageLower.includes("education") || messageLower.includes("learn")) {
      query = query.contains("themes", ["Conservation Education"]);
    }
    
    // Search by location
    const locations = ["maasai mara", "amboseli", "tsavo", "mombasa", "nairobi", "laikipia", "samburu"];
    for (const loc of locations) {
      if (messageLower.includes(loc)) {
        query = query.ilike("location_text", `%${loc}%`);
        break;
      }
    }
    
    const { data, error } = await query.limit(3);
    
    if (error) throw error;
    return { name: "experienceSearch", data: data || [] };
  } catch (error) {
    console.error("Experience search error:", error);
    return { name: "experienceSearch", data: [] };
  }
}

async function tool_tripCarbon(q: string): Promise<ToolResult> {
  // Simple heuristic for carbon estimation
  const domesticFlight = q.toLowerCase().includes("flight") || q.toLowerCase().includes("fly");
  const roadTrip = q.toLowerCase().includes("drive") || q.toLowerCase().includes("road");
  
  let estimate = 0.01; // default low impact
  if (domesticFlight) estimate = 0.15; // tCO2e per 100km
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

async function generateResponse(userMessage: string, tools: ToolResult[]): Promise<{ answer: string, suggestions: string[] }> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    // Fallback response when OpenAI is not configured
    const messageLower = userMessage.toLowerCase();
    let answer = "";
    
    // Use tool data for fallback responses
    const speciesData = tools.find(t => t.name === "speciesLookup")?.data;
    const partnerData = tools.find(t => t.name === "partnerFacts")?.data;
    const carbonData = tools.find(t => t.name === "tripCarbon")?.data;
    const experienceData = tools.find(t => t.name === "experienceSearch")?.data;
    
    if (experienceData && experienceData.length > 0) {
      const exp = experienceData[0];
      answer = `I recommend "${exp.title}" in ${exp.location_text}. ${exp.description.substring(0, 150)}... This ${exp.duration_hours}-hour experience costs KES ${exp.price_kes_adult} per adult. Would you like to book this or see more options?`;
    } else if (speciesData && speciesData.length > 0) {
      const species = speciesData[0];
      answer = `I found information about ${species.common_name} (${species.scientific_name}). ${species.notes} They're found in: ${species.regions.join(", ")}.`;
    } else if (partnerData && partnerData.length > 0) {
      const partner = partnerData[0];
      answer = `I found ${partner.org_name} in ${partner.location}. ${partner.bio}`;
    } else if (carbonData) {
      answer = `For travel carbon impact: ${carbonData.advice}. Estimated factor: ${carbonData.factor} tCO2e per 100km.`;
    } else {
      // Contextual responses based on user query
      if (messageLower.includes('park') || messageLower.includes('reserve')) {
        answer = "Kenya has amazing national parks like Maasai Mara, Amboseli, and Tsavo. Each offers unique wildlife experiences and supports local communities through conservation tourism.";
      } else if (messageLower.includes('season') || messageLower.includes('when')) {
        answer = "The dry seasons (January-March and June-October) are generally best for wildlife viewing. The Great Migration in Maasai Mara typically occurs July-October.";
      } else if (messageLower.includes('community') || messageLower.includes('conservancy')) {
        answer = "Community conservancies like Ol Kinyei, Kimana, and Amboseli ecosystem conservancies work with local Maasai communities to protect wildlife while providing sustainable livelihoods.";
      } else {
        answer = "I can help you learn about Kenyan wildlife, conservation areas, sustainable travel tips, and community conservation projects. What specific topic interests you?";
      }
    }
    
    const suggestions = [
      experienceData?.length > 0 ? "Show me more experiences" : "What can I book?",
      speciesData?.length > 0 ? "More about this species" : "Tell me about elephants",
      carbonData ? "Eco-friendly travel tips" : "Best parks to visit"
    ];
    
    return { answer, suggestions };
  }
  
  try {
    // Prepare context from tools
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
        max_tokens: 300,
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
    if (userMessage.toLowerCase().includes('elephant') || userMessage.toLowerCase().includes('wildlife')) {
      suggestions.push("Threats & protection status", "Best viewing seasons", "Community conservation projects");
    } else if (userMessage.toLowerCase().includes('travel') || userMessage.toLowerCase().includes('visit')) {
      suggestions.push("Lower-impact alternatives", "Best season to visit", "Local community benefits");
    } else {
      suggestions.push("Find nearby conservancies", "Wildlife in this region", "Community benefits & how to support");
    }
    
    return { answer, suggestions: suggestions.slice(0, 3) };
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Contextual fallback using available tool data instead of a generic error
    const messageLower = userMessage.toLowerCase();
    let answer = "";

    const speciesData = tools.find(t => t.name === "speciesLookup")?.data;
    const partnerData = tools.find(t => t.name === "partnerFacts")?.data;
    const carbonData = tools.find(t => t.name === "tripCarbon")?.data;

    if (speciesData && speciesData.length > 0) {
      const species = speciesData[0];
      answer = `I found information about ${species.common_name} (${species.scientific_name}). ${species.notes} They're found in: ${species.regions.join(", ")}.`;
    } else if (partnerData && partnerData.length > 0) {
      const partner = partnerData[0];
      answer = `I found ${partner.org_name} in ${partner.location}. ${partner.bio}`;
    } else if (carbonData) {
      answer = `For travel carbon impact: ${carbonData.advice}. Estimated factor: ${carbonData.factor} tCO2e per 100km.`;
    } else {
      if (messageLower.includes('park') || messageLower.includes('reserve')) {
        answer = "Kenya has amazing national parks like Maasai Mara, Amboseli, and Tsavo. Each offers unique wildlife experiences and supports local communities through conservation tourism.";
      } else if (messageLower.includes('season') || messageLower.includes('when')) {
        answer = "The dry seasons (January-March and June-October) are generally best for wildlife viewing. The Great Migration in Maasai Mara typically occurs July-October.";
      } else if (messageLower.includes('community') || messageLower.includes('conservancy')) {
        answer = "Community conservancies like Ol Kinyei, Kimana, and Amboseli ecosystem conservancies work with local Maasai communities to protect wildlife while providing sustainable livelihoods.";
      } else {
        answer = "I can help you learn about Kenyan wildlife, conservation areas, sustainable travel tips, and community conservation projects. What specific topic interests you?";
      }
    }

    const suggestions = [
      speciesData?.length > 0 ? "More about this species" : "Tell me about elephants",
      carbonData ? "Eco-friendly travel tips" : "Best parks to visit",
      partnerData?.length > 0 ? "Other conservation partners" : "Community conservation projects"
    ];

    return { answer, suggestions };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
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
    
    console.log(`Processing message: "${userMessage}" for user: ${userId}`);
    
    // Analyze user intent and call appropriate tools
    const messageLower = userMessage.toLowerCase();
    const wantsSpecies = /elephant|lion|cheetah|zebra|rhino|giraffe|bird|wildlife|animal|species/i.test(userMessage);
    const wantsPartner = /partner|community|project|conservancy|organization/i.test(userMessage);
    const wantsCarbon = /carbon|emission|footprint|impact|travel|flight|drive/i.test(userMessage);
    const wantsExperience = /book|experience|safari|tour|visit|activity|do|recommend|trip|travel|see/i.test(userMessage);
    
    console.log(`Intent analysis - Species: ${wantsSpecies}, Partner: ${wantsPartner}, Carbon: ${wantsCarbon}, Experience: ${wantsExperience}`);
    
    // Call relevant tools
    const tools: ToolResult[] = [];
    if (wantsSpecies) {
      const speciesResult = await tool_speciesLookup(userMessage);
      tools.push(speciesResult);
      console.log(`Species lookup returned ${speciesResult.data.length} results`);
    }
    if (wantsPartner) {
      const partnerResult = await tool_partnerFacts(userMessage);
      tools.push(partnerResult);
      console.log(`Partner lookup returned ${partnerResult.data.length} results`);
    }
    if (wantsCarbon) {
      const carbonResult = await tool_tripCarbon(userMessage);
      tools.push(carbonResult);
      console.log(`Carbon estimation: ${JSON.stringify(carbonResult.data)}`);
    }
    if (wantsExperience) {
      const experienceResult = await tool_experienceSearch(userMessage);
      tools.push(experienceResult);
      console.log(`Experience search returned ${experienceResult.data.length} results`);
    }
    
    // Generate AI response
    const { answer, suggestions } = await generateResponse(userMessage, tools);
    
    // Log conversation (if user is provided)
    if (userId) {
      try {
        await supabase.from('chat_logs').insert({
          user_id: userId,
          query: userMessage,
          response: answer
        });
      } catch (logError) {
        console.error('Failed to log conversation:', logError);
        // Don't fail the request if logging fails
      }
    }
    
    console.log(`Generated response with ${suggestions.length} suggestions`);
    
    return new Response(JSON.stringify({
      answer,
      tools,
      suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('AsiliChat error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      answer: "I'm experiencing some technical difficulties. Please try again!",
      suggestions: ["Ask about elephants", "Learn about conservancies", "Travel season advice"]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});