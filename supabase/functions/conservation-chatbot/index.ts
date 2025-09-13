import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const iucnApiKey = Deno.env.get('IUCN_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userId } = await req.json();
    
    if (!query) {
      throw new Error('Query is required');
    }

    console.log(`Processing query: ${query} for user: ${userId}`);

    // First, try to extract species name from query
    const extractedSpecies = await extractSpeciesFromQuery(query);
    console.log(`Extracted species: ${extractedSpecies}`);

    let speciesData = null;
    let speciesId = null;

    if (extractedSpecies) {
      // Check if we have the species data in our database
      const { data: existingSpecies, error: speciesError } = await supabase
        .from('species_data')
        .select('*')
        .or(`common_name.ilike.%${extractedSpecies}%,scientific_name.ilike.%${extractedSpecies}%`)
        .limit(1)
        .maybeSingle();

      if (!speciesError && existingSpecies) {
        speciesData = existingSpecies;
        speciesId = existingSpecies.id;
        console.log(`Found existing species data for: ${existingSpecies.common_name}`);
      } else {
        // Fetch from IUCN Red List API
        const iucnData = await fetchFromIUCN(extractedSpecies);
        if (iucnData) {
          // Store in our database
          const { data: newSpecies, error: insertError } = await supabase
            .from('species_data')
            .insert({
              scientific_name: iucnData.scientific_name || extractedSpecies,
              common_name: iucnData.common_name || extractedSpecies,
              classification: iucnData.classification || {},
              population_status: iucnData.population_status,
              threats: iucnData.threats || [],
              habitat: iucnData.habitat,
              distribution: iucnData.distribution,
              description: iucnData.description,
              source: 'IUCN'
            })
            .select()
            .single();

          if (!insertError && newSpecies) {
            speciesData = newSpecies;
            speciesId = newSpecies.id;
            console.log(`Added new species data for: ${newSpecies.common_name}`);
          }
        }
      }
    }

    // Generate AI response using OpenAI
    const aiResponse = await generateConservationResponse(query, speciesData);

    // Log the conversation
    if (userId) {
      await supabase
        .from('chat_logs')
        .insert({
          user_id: userId,
          query,
          species_id: speciesId,
          response: aiResponse
        });
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      species_data: speciesData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in conservation-chatbot function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function extractSpeciesFromQuery(query: string): Promise<string | null> {
  if (!openaiApiKey) {
    // Simple fallback extraction
    const words = query.toLowerCase().split(' ');
    const animalKeywords = ['elephant', 'giraffe', 'lion', 'leopard', 'rhino', 'zebra', 'cheetah', 'buffalo'];
    return animalKeywords.find(keyword => words.includes(keyword)) || null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Extract the species name (common or scientific) from the user query. Return only the species name or null if no species is mentioned. Examples: "Tell me about elephants" -> "elephant", "What is Panthera leo?" -> "Panthera leo", "How is the weather?" -> null'
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      }),
    });

    const data = await response.json();
    const extracted = data.choices[0]?.message?.content?.trim();
    return extracted && extracted !== 'null' ? extracted : null;
  } catch (error) {
    console.error('Error extracting species:', error);
    return null;
  }
}

async function fetchFromIUCN(speciesName: string): Promise<any> {
  try {
    // IUCN Red List API endpoint for species search
    const searchUrl = `https://apiv3.iucnredlist.org/api/v3/species/page/0?token=${iucnApiKey}`;
    
    console.log(`Searching IUCN for: ${speciesName}`);
    
    // Note: The IUCN API requires specific endpoints. This is a simplified version.
    // In practice, you might need to search by scientific name or use their species endpoint.
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      console.log('IUCN API not available, using fallback data');
      return createFallbackSpeciesData(speciesName);
    }

    const data = await response.json();
    
    // Process IUCN data structure (simplified)
    if (data.result && data.result.length > 0) {
      const species = data.result[0];
      return {
        scientific_name: species.scientific_name,
        common_name: species.main_common_name || speciesName,
        classification: {
          kingdom: species.kingdom,
          phylum: species.phylum,
          class: species.class,
          order: species.order,
          family: species.family
        },
        population_status: species.category,
        threats: species.threats || [],
        habitat: species.habitat || '',
        distribution: species.range || '',
        description: species.narrative || ''
      };
    }
    
    return createFallbackSpeciesData(speciesName);
  } catch (error) {
    console.error('Error fetching from IUCN:', error);
    return createFallbackSpeciesData(speciesName);
  }
}

function createFallbackSpeciesData(speciesName: string) {
  // Create fallback data for common African species
  const fallbackData: { [key: string]: any } = {
    'elephant': {
      scientific_name: 'Loxodonta africana',
      common_name: 'African Elephant',
      classification: { kingdom: 'Animalia', class: 'Mammalia', order: 'Proboscidea', family: 'Elephantidae' },
      population_status: 'Endangered',
      threats: ['Poaching', 'Habitat loss', 'Human-wildlife conflict'],
      habitat: 'Savannas, forests, deserts, and grasslands',
      distribution: 'Sub-Saharan Africa',
      description: 'The African elephant is the largest land mammal and plays a crucial role in ecosystem maintenance.'
    },
    'giraffe': {
      scientific_name: 'Giraffa camelopardalis',
      common_name: 'Giraffe',
      classification: { kingdom: 'Animalia', class: 'Mammalia', order: 'Artiodactyla', family: 'Giraffidae' },
      population_status: 'Vulnerable',
      threats: ['Habitat loss', 'Poaching', 'Civil unrest'],
      habitat: 'Open woodlands, grasslands, and savannas',
      distribution: 'Africa',
      description: 'The giraffe is the tallest mammal on Earth and an iconic species of African savannas.'
    }
  };

  const normalizedName = speciesName.toLowerCase();
  return fallbackData[normalizedName] || {
    scientific_name: speciesName,
    common_name: speciesName,
    classification: {},
    population_status: 'Unknown',
    threats: [],
    habitat: 'Various habitats',
    distribution: 'Unknown',
    description: `Information about ${speciesName} is being researched.`
  };
}

async function generateConservationResponse(query: string, speciesData: any): Promise<string> {
  if (!openaiApiKey) {
    // Fallback response without AI
    if (speciesData) {
      return `${speciesData.common_name} (${speciesData.scientific_name}) is currently classified as ${speciesData.population_status}. ${speciesData.description} This species faces threats including ${speciesData.threats.join(', ')}. Conserving ${speciesData.common_name} is important for maintaining ecosystem balance and biodiversity.`;
    }
    return "I'm here to help you learn about wildlife conservation. Please ask me about specific species or conservation topics.";
  }

  try {
    const systemPrompt = `You are a conversational conservation assistant for NatuAsili. 
- When the user asks about a species, use the provided species data to give accurate information.
- Summarise the species' classification, population status, major threats, habitat and any interesting ecological relationships.
- Use simple, factual language and avoid speculative statements.
- End with a brief note on why conserving this species matters.
- If no species data is provided, give general conservation guidance.
- Keep responses concise but informative (2-3 paragraphs maximum).`;

    const userMessage = speciesData 
      ? `Query: ${query}\n\nSpecies Data: ${JSON.stringify(speciesData, null, 2)}`
      : query;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I encountered an issue generating a response. Please try again.';
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'I apologize, but I encountered an issue generating a response. Please try again.';
  }
}