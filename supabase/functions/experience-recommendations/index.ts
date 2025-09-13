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
const meteosourceApiKey = Deno.env.get('METEOSOURCE_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, preferences, desiredDate, location } = await req.json();

    console.log(`Generating recommendations for user: ${userId}, date: ${desiredDate}`);

    // Get user preferences from database if not provided
    let userPrefs = preferences;
    if (!userPrefs && userId) {
      const { data: dbPrefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      userPrefs = dbPrefs || {
        group_type: 'individual',
        adventure_level: 'moderate',
        donation_interest: false,
        preferences_json: {}
      };
    }

    // Get weather data for the desired date
    const weatherData = await getWeatherForecast(location, desiredDate);
    
    // Get wildlife activity patterns for the month
    const month = new Date(desiredDate).getMonth() + 1;
    const wildlifeActivity = await getWildlifeActivity(month, location);

    // Get all available experiences
    const { data: experiences, error: expError } = await supabase
      .from('experiences')
      .select('*')
      .eq('visible_on_marketplace', true);

    if (expError) throw expError;

    // Filter and rank experiences
    const rankedExperiences = await rankExperiences(
      experiences || [],
      userPrefs,
      weatherData,
      wildlifeActivity,
      desiredDate
    );

    // Generate AI-powered recommendations
    const aiRecommendations = await generateRecommendations(
      rankedExperiences.slice(0, 5),
      userPrefs,
      weatherData,
      wildlifeActivity
    );

    // Find nearby experiences for bundling
    const bundles = await suggestBundles(rankedExperiences.slice(0, 3));

    return new Response(JSON.stringify({ 
      recommendations: rankedExperiences.slice(0, 3),
      ai_summary: aiRecommendations,
      suggested_bundles: bundles,
      weather_context: weatherData,
      wildlife_activity: wildlifeActivity
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in experience-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getWeatherForecast(location: string, date: string) {
  if (!meteosourceApiKey) {
    console.log('No Meteosource API key, using fallback weather data');
    return {
      temperature: 25,
      precipitation_probability: 0.2,
      weather_condition: 'partly_cloudy',
      suitable_for_outdoor: true
    };
  }

  try {
    // Meteosource API for weather forecast
    const locationQuery = encodeURIComponent(location || 'Nairobi, Kenya');
    const apiUrl = `https://www.meteosource.com/api/v1/free/point?place_id=${locationQuery}&sections=daily&timezone=UTC&language=en&units=metric&key=${meteosourceApiKey}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.log('Weather API error, using fallback');
      return {
        temperature: 25,
        precipitation_probability: 0.2,
        weather_condition: 'partly_cloudy',
        suitable_for_outdoor: true
      };
    }

    const data = await response.json();
    const targetDate = new Date(date);
    const today = new Date();
    const daysDiff = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 0 && daysDiff < 7 && data.daily?.data?.[daysDiff]) {
      const dayData = data.daily.data[daysDiff];
      return {
        temperature: dayData.temperature || 25,
        precipitation_probability: dayData.precipitation?.total || 0,
        weather_condition: dayData.weather || 'clear',
        suitable_for_outdoor: (dayData.precipitation?.total || 0) < 5
      };
    }

    return {
      temperature: 25,
      precipitation_probability: 0.2,
      weather_condition: 'partly_cloudy',
      suitable_for_outdoor: true
    };

  } catch (error) {
    console.error('Error fetching weather:', error);
    return {
      temperature: 25,
      precipitation_probability: 0.2,
      weather_condition: 'partly_cloudy',
      suitable_for_outdoor: true
    };
  }
}

async function getWildlifeActivity(month: number, location?: string) {
  try {
    const { data: activity, error } = await supabase
      .from('wildlife_activity')
      .select('*')
      .eq('month', month)
      .order('activity_level', { ascending: false });

    if (error) throw error;

    return activity || [];
  } catch (error) {
    console.error('Error fetching wildlife activity:', error);
    return [];
  }
}

async function rankExperiences(
  experiences: any[],
  userPrefs: any,
  weatherData: any,
  wildlifeActivity: any[],
  desiredDate: string
) {
  const scoredExperiences = experiences.map(exp => {
    let score = 0;

    // Group type preference
    if (userPrefs.group_type === 'family' && exp.categories?.includes('family-friendly')) {
      score += 30;
    } else if (userPrefs.group_type === 'adventure' && exp.categories?.includes('adventure')) {
      score += 30;
    }

    // Adventure level matching
    if (userPrefs.adventure_level === 'high' && exp.categories?.includes('challenging')) {
      score += 25;
    } else if (userPrefs.adventure_level === 'low' && exp.categories?.includes('easy')) {
      score += 25;
    }

    // Weather suitability
    if (!weatherData.suitable_for_outdoor && exp.unsuitable_weather?.includes('rain')) {
      score -= 40; // Heavily penalize rain-unsuitable activities in bad weather
    } else if (weatherData.suitable_for_outdoor) {
      score += 15;
    }

    // Wildlife activity bonus
    const activeSpecies = wildlifeActivity.filter(w => w.activity_level > 0.7);
    const expSpecies = exp.species_likely || [];
    const speciesMatch = expSpecies.some((species: string) => 
      activeSpecies.some(active => 
        active.species_name?.toLowerCase().includes(species.toLowerCase())
      )
    );
    if (speciesMatch) {
      score += 35;
    }

    // Seasonal preference
    const month = new Date(desiredDate).getMonth() + 1;
    if (exp.best_seasons?.includes(month)) {
      score += 20;
    }

    // Donation interest
    if (userPrefs.donation_interest && exp.donation_options && Object.keys(exp.donation_options).length > 0) {
      score += 15;
    }

    return { ...exp, recommendation_score: score };
  });

  return scoredExperiences
    .sort((a, b) => b.recommendation_score - a.recommendation_score)
    .filter(exp => exp.recommendation_score > 0);
}

async function generateRecommendations(
  topExperiences: any[],
  userPrefs: any,
  weatherData: any,
  wildlifeActivity: any[]
) {
  if (!openaiApiKey) {
    return "Based on your preferences and current conditions, these experiences offer great opportunities for wildlife viewing and conservation engagement.";
  }

  try {
    const systemPrompt = `You are NatuAsili's tour concierge. 
- Suggest up to three experiences based on user profile and conditions.
- Consider weather conditions and wildlife activity patterns.
- Tailor suggestions: for families, emphasise safe, educational tours; for adventure seekers, propose challenging activities; for donor types, highlight high-impact projects.
- When appropriate, suggest bundled itineraries and mention carbon offset options.
- Keep the response conversational and personalized.`;

    const contextData = {
      user_profile: userPrefs,
      weather: weatherData,
      wildlife_activity: wildlifeActivity.slice(0, 3),
      top_experiences: topExperiences.map(exp => ({
        title: exp.title,
        location: exp.location_text,
        categories: exp.categories,
        species_likely: exp.species_likely
      }))
    };

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
          { role: 'user', content: `Please recommend experiences based on this data: ${JSON.stringify(contextData, null, 2)}` }
        ],
        max_tokens: 400,
        temperature: 0.8
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'These experiences are carefully selected to match your interests and current conditions.';
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return 'These experiences are carefully selected to match your interests and provide meaningful conservation impact.';
  }
}

async function suggestBundles(topExperiences: any[]) {
  if (topExperiences.length < 2) return [];

  const bundles = [];
  
  // Group experiences by location proximity (simplified)
  const locationGroups: { [key: string]: any[] } = {};
  
  topExperiences.forEach(exp => {
    const location = exp.location_text?.split(',')[0] || 'Other';
    if (!locationGroups[location]) {
      locationGroups[location] = [];
    }
    locationGroups[location].push(exp);
  });

  // Create bundles from location groups
  Object.entries(locationGroups).forEach(([location, experiences]) => {
    if (experiences.length >= 2) {
      bundles.push({
        title: `${location} Conservation Bundle`,
        experiences: experiences.slice(0, 2),
        estimated_duration: '2 days',
        bundle_discount: '10%',
        carbon_offset_included: true
      });
    }
  });

  return bundles;
}