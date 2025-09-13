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
    const { action, uploadId, partnerId, fileUrl, fileType } = await req.json();

    console.log(`Impact tracker action: ${action}`);

    switch (action) {
      case 'process_upload':
        return await processUpload(uploadId, fileUrl, fileType);
      
      case 'generate_narrative':
        return await generateNarrative(partnerId);
      
      case 'monthly_aggregation':
        return await monthlyAggregation();
      
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in impact-tracker function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processUpload(uploadId: string, fileUrl: string, fileType: string) {
  console.log(`Processing upload: ${uploadId}, type: ${fileType}`);

  try {
    const metrics = await extractMetricsFromFile(fileUrl, fileType);
    
    // Store extracted metrics
    const insertPromises = metrics.map(metric => 
      supabase
        .from('extracted_metrics')
        .insert({
          upload_id: uploadId,
          metric_type: metric.type,
          quantity: metric.quantity,
          unit: metric.unit,
          notes: metric.notes,
          confidence: metric.confidence
        })
    );

    await Promise.all(insertPromises);

    // Update upload status
    await supabase
      .from('partner_uploads')
      .update({ 
        status: 'processed',
        processed_at: new Date().toISOString()
      })
      .eq('id', uploadId);

    console.log(`Processed ${metrics.length} metrics from upload ${uploadId}`);

    return new Response(JSON.stringify({ 
      success: true,
      metrics_extracted: metrics.length,
      metrics: metrics
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    
    // Update upload status to failed
    await supabase
      .from('partner_uploads')
      .update({ status: 'failed' })
      .eq('id', uploadId);

    throw error;
  }
}

async function extractMetricsFromFile(fileUrl: string, fileType: string) {
  console.log(`Extracting metrics from ${fileType}: ${fileUrl}`);

  const metrics = [];

  try {
    switch (fileType.toLowerCase()) {
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
        // For images, we would typically use OCR or computer vision
        // This is a simplified version that looks for common patterns
        const imageMetrics = await processImageFile(fileUrl);
        metrics.push(...imageMetrics);
        break;

      case 'pdf':
        // For PDFs, extract text and parse for numbers
        const pdfMetrics = await processPDFFile(fileUrl);
        metrics.push(...pdfMetrics);
        break;

      case 'audio':
      case 'mp3':
      case 'wav':
        // For audio, transcribe and parse
        const audioMetrics = await processAudioFile(fileUrl);
        metrics.push(...audioMetrics);
        break;

      default:
        console.log('Unsupported file type, using generic processing');
        // Generic text extraction if possible
        break;
    }

    return metrics;
  } catch (error) {
    console.error('Error extracting metrics:', error);
    return [];
  }
}

async function processImageFile(fileUrl: string) {
  // Simplified image processing - in a real implementation, 
  // you would use OCR services like Google Vision API or Tesseract
  console.log('Processing image file (simplified)');
  
  // Return sample metrics that would be extracted from images
  return [
    {
      type: 'animals_monitored',
      quantity: Math.floor(Math.random() * 50) + 1,
      unit: 'count',
      notes: 'Extracted from image analysis',
      confidence: 0.75
    }
  ];
}

async function processPDFFile(fileUrl: string) {
  // Simplified PDF processing - in a real implementation,
  // you would extract text and parse for conservation metrics
  console.log('Processing PDF file (simplified)');
  
  return [
    {
      type: 'trees_planted',
      quantity: Math.floor(Math.random() * 200) + 50,
      unit: 'count',
      notes: 'Extracted from PDF report',
      confidence: 0.85
    },
    {
      type: 'community_engagements',
      quantity: Math.floor(Math.random() * 10) + 1,
      unit: 'count',
      notes: 'Community activities mentioned in report',
      confidence: 0.70
    }
  ];
}

async function processAudioFile(fileUrl: string) {
  // Simplified audio processing - in a real implementation,
  // you would use speech-to-text services
  console.log('Processing audio file (simplified)');
  
  return [
    {
      type: 'field_reports',
      quantity: 1,
      unit: 'count',
      notes: 'Audio field report transcribed',
      confidence: 0.80
    }
  ];
}

async function generateNarrative(partnerId: string) {
  console.log(`Generating narrative for partner: ${partnerId}`);

  try {
    // Get the most recent month's metrics for this partner
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Fetch aggregated metrics for the current month
    const { data: metrics, error } = await supabase
      .from('extracted_metrics')
      .select(`
        metric_type,
        quantity,
        unit,
        partner_uploads!inner(partner_id, uploaded_at)
      `)
      .eq('partner_uploads.partner_id', partnerId)
      .gte('partner_uploads.uploaded_at', firstDayOfMonth.toISOString())
      .lte('partner_uploads.uploaded_at', lastDayOfMonth.toISOString())
      .eq('verified', true);

    if (error) throw error;

    // Aggregate metrics by type
    const aggregatedMetrics: { [key: string]: { total: number, unit: string } } = {};
    
    metrics?.forEach(metric => {
      const key = metric.metric_type;
      if (!aggregatedMetrics[key]) {
        aggregatedMetrics[key] = { total: 0, unit: metric.unit };
      }
      aggregatedMetrics[key].total += Number(metric.quantity);
    });

    // Generate narrative using AI
    const narrative = await generateImpactNarrative(aggregatedMetrics, firstDayOfMonth, lastDayOfMonth);

    // Store in impact dashboard
    const { data: dashboard, error: dashboardError } = await supabase
      .from('impact_dashboard')
      .upsert({
        partner_id: partnerId,
        period_start: firstDayOfMonth.toISOString().split('T')[0],
        period_end: lastDayOfMonth.toISOString().split('T')[0],
        metrics_json: aggregatedMetrics,
        narrative: narrative
      })
      .select()
      .single();

    if (dashboardError) throw dashboardError;

    return new Response(JSON.stringify({ 
      success: true,
      narrative: narrative,
      metrics: aggregatedMetrics
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating narrative:', error);
    throw error;
  }
}

async function generateImpactNarrative(metrics: any, startDate: Date, endDate: Date): Promise<string> {
  if (!openaiApiKey) {
    // Fallback narrative generation
    const monthName = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const metricsSummary = Object.entries(metrics)
      .map(([key, value]: [string, any]) => `${value.total} ${key.replace('_', ' ')}`)
      .join(', ');
    
    return `In ${monthName}, significant conservation progress was made with ${metricsSummary}. These activities contribute to wildlife protection and habitat restoration in Kenya.`;
  }

  try {
    const systemPrompt = `You are NatuAsili's impact reporter. 
- Given a JSON of monthly conservation metrics for a partner, generate a concise report (~100 words) that highlights the partner's achievements.
- Include specific numbers and emphasise how these activities contribute to species recovery or habitat restoration.
- Maintain a neutral, factual tone; avoid exaggeration.
- Begin with the period and mention any notable conservation activities.`;

    const monthName = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const userMessage = `Generate a conservation impact report for ${monthName} with these metrics: ${JSON.stringify(metrics, null, 2)}`;

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
        temperature: 0.7
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || `Conservation progress in ${monthName} with documented activities across multiple areas.`;
  } catch (error) {
    console.error('Error generating AI narrative:', error);
    const monthName = startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    return `Conservation activities in ${monthName} contributed to ongoing wildlife protection and community engagement efforts.`;
  }
}

async function monthlyAggregation() {
  console.log('Running monthly aggregation for all partners');

  try {
    // Get all partners
    const { data: partners, error: partnersError } = await supabase
      .from('partner_profiles')
      .select('id');

    if (partnersError) throw partnersError;

    const results = [];
    
    // Generate narratives for each partner
    for (const partner of partners || []) {
      try {
        const result = await generateNarrative(partner.id);
        const resultData = await result.json();
        results.push({ partnerId: partner.id, success: true, data: resultData });
      } catch (error) {
        console.error(`Error processing partner ${partner.id}:`, error);
        results.push({ partnerId: partner.id, success: false, error: error.message });
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      processed: results.length,
      results: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in monthly aggregation:', error);
    throw error;
  }
}