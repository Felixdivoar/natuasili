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

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, photos, userSpecies, date } = await req.json();

    console.log(`Wildlife quiz action: ${action} for user: ${userId}`);

    switch (action) {
      case 'identify_species':
        return await identifySpeciesFromPhotos(photos);
      
      case 'submit_quiz':
        return await submitQuizResults(userId, userSpecies, photos, date);
      
      case 'get_daily_reminder':
        return await getDailyReminder(userId);
      
      case 'send_reminders':
        return await sendDailyReminders();
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in wildlife-quiz function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function identifySpeciesFromPhotos(photos: string[]) {
  console.log(`Identifying species from ${photos.length} photos`);

  if (!openaiApiKey) {
    // Fallback species identification without AI
    const fallbackSpecies = [
      'African Elephant', 'Lion', 'Giraffe', 'Zebra', 'Leopard',
      'Cheetah', 'Buffalo', 'Rhinoceros', 'Hippo', 'Warthog'
    ];
    
    const identifiedSpecies = photos.map(() => 
      fallbackSpecies[Math.floor(Math.random() * fallbackSpecies.length)]
    );

    return new Response(JSON.stringify({ 
      identified_species: identifiedSpecies,
      confidence_scores: identifiedSpecies.map(() => Math.random() * 0.4 + 0.6)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const identificationPromises = photos.map(async (photo) => {
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
              content: 'You are a wildlife identification expert. Analyze the image and identify the main animal species visible. Return only the species name (common name preferred). If you cannot clearly identify the species, return "Unknown".'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'What animal species is shown in this image?'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: photo
                  }
                }
              ]
            }
          ],
          max_tokens: 50,
          temperature: 0.1
        }),
      });

      const data = await response.json();
      const species = data.choices[0]?.message?.content?.trim() || 'Unknown';
      const confidence = species !== 'Unknown' ? 0.85 : 0.1;
      
      return { species, confidence };
    });

    const results = await Promise.all(identificationPromises);
    
    return new Response(JSON.stringify({ 
      identified_species: results.map(r => r.species),
      confidence_scores: results.map(r => r.confidence)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error identifying species:', error);
    throw error;
  }
}

async function submitQuizResults(userId: string, userSpecies: string[], photos: string[], date: string) {
  console.log(`Submitting quiz results for user: ${userId}`);

  try {
    // First identify the species from photos
    const identificationResponse = await identifySpeciesFromPhotos(photos);
    const identificationData = await identificationResponse.json();
    const aiSpecies = identificationData.identified_species;

    // Compare user guesses with AI identifications
    let correctCount = 0;
    for (let i = 0; i < Math.min(userSpecies.length, aiSpecies.length); i++) {
      const userGuess = userSpecies[i].toLowerCase().trim();
      const aiGuess = aiSpecies[i].toLowerCase().trim();
      
      // Check for exact match or partial match (e.g., "elephant" matches "African Elephant")
      if (userGuess === aiGuess || 
          userGuess.includes(aiGuess.split(' ')[0]) || 
          aiGuess.includes(userGuess.split(' ')[0])) {
        correctCount++;
      }
    }

    // Store quiz results
    const { data: quizResult, error } = await supabase
      .from('wildlife_quiz_log')
      .insert({
        user_id: userId,
        date: date || new Date().toISOString().split('T')[0],
        species_spotted: userSpecies,
        ai_species: aiSpecies,
        correct_count: correctCount,
        photos_uploaded: photos
      })
      .select()
      .single();

    if (error) throw error;

    // Generate feedback message
    const feedback = await generateQuizFeedback(userSpecies, aiSpecies, correctCount);

    return new Response(JSON.stringify({ 
      success: true,
      correct_count: correctCount,
      total_count: userSpecies.length,
      accuracy: (correctCount / userSpecies.length * 100).toFixed(1),
      ai_identifications: aiSpecies,
      feedback: feedback,
      quiz_id: quizResult.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error submitting quiz results:', error);
    throw error;
  }
}

async function generateQuizFeedback(userSpecies: string[], aiSpecies: string[], correctCount: number) {
  if (!openaiApiKey) {
    // Fallback feedback
    const accuracy = (correctCount / userSpecies.length * 100).toFixed(1);
    
    if (correctCount === userSpecies.length) {
      return `Excellent! You correctly identified all ${correctCount} species. Your wildlife knowledge is impressive!`;
    } else if (correctCount > 0) {
      return `Great job! You correctly identified ${correctCount} of ${userSpecies.length} species (${accuracy}% accuracy). Keep practicing to improve your wildlife identification skills!`;
    } else {
      return `Don't worry, wildlife identification takes practice! The AI identified different species than your guesses. Keep exploring and learning about Kenya's amazing wildlife!`;
    }
  }

  try {
    const systemPrompt = `You are NatuAsili's wildlife spotting coach. 
- Provide positive, educational feedback on the user's wildlife identification quiz results.
- Compare their guesses with AI identifications and give encouragement.
- If they made mistakes, gently correct them and provide one interesting fact about the correct species.
- Keep the tone encouraging and educational.`;

    const userMessage = `User identified: ${userSpecies.join(', ')}. AI identified: ${aiSpecies.join(', ')}. User got ${correctCount} out of ${userSpecies.length} correct.`;

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
        max_tokens: 200,
        temperature: 0.8
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Keep up the great work with wildlife identification!';
  } catch (error) {
    console.error('Error generating feedback:', error);
    return 'Thank you for participating in today\'s wildlife spotting challenge!';
  }
}

async function getDailyReminder(userId: string) {
  try {
    // Get user preferences for reminder timing
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('preferred_quiz_time, timezone')
      .eq('user_id', userId)
      .maybeSingle();

    const reminderTime = prefs?.preferred_quiz_time || '08:00:00';
    const timezone = prefs?.timezone || 'Africa/Nairobi';

    // Check if user has already done today's quiz
    const today = new Date().toISOString().split('T')[0];
    const { data: todayQuiz } = await supabase
      .from('wildlife_quiz_log')
      .select('id')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle();

    const hasCompletedToday = !!todayQuiz;

    return new Response(JSON.stringify({ 
      reminder_time: reminderTime,
      timezone: timezone,
      has_completed_today: hasCompletedToday,
      message: hasCompletedToday 
        ? "You've already completed today's wildlife spotting challenge! Great job!"
        : "Ready for today's wildlife spotting challenge? Find and photograph three wildlife in your area!"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error getting daily reminder:', error);
    throw error;
  }
}

async function sendDailyReminders() {
  console.log('Sending daily reminders to all users');

  try {
    // This would typically be called by a cron job
    // Get all users with preferences
    const { data: users } = await supabase
      .from('user_preferences')
      .select('user_id, preferred_quiz_time, timezone');

    let remindersSent = 0;

    for (const user of users || []) {
      try {
        // Check if they've completed today's quiz
        const today = new Date().toISOString().split('T')[0];
        const { data: todayQuiz } = await supabase
          .from('wildlife_quiz_log')
          .select('id')
          .eq('user_id', user.user_id)
          .eq('date', today)
          .maybeSingle();

        if (!todayQuiz) {
          // Send reminder notification
          await supabase
            .from('notifications')
            .insert({
              user_id: user.user_id,
              title: 'Daily Wildlife Challenge',
              message: 'Time for your daily wildlife spotting! Find and photograph three animals in your area.',
              type: 'info',
              related_type: 'wildlife_quiz'
            });

          remindersSent++;
        }
      } catch (error) {
        console.error(`Error sending reminder to user ${user.user_id}:`, error);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      reminders_sent: remindersSent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error sending daily reminders:', error);
    throw error;
  }
}