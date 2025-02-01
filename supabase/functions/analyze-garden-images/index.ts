import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json();
    console.log('Analyzing garden images:', imageUrls);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a garden biodiversity expert. Analyze the garden images and fill out a questionnaire about the garden's features. 
            Return ONLY a JSON object with the questionnaire answers, no other text.
            
            The questionnaire structure should match these sections and question IDs:
            - general: landSize, landUse, currentMeasures
            - habitat: vegetationTypes, nativeSpecies, vegetationHeight
            - wildlife: wildlifeFeatures, waterFeatures, foodSources
            - management: grassManagement, chemicalUse, soilHealth
            - connectivity: landConnectivity, wildlifeBarriers, sustainableUse
            - future: improvements, aspectsToImprove`
          },
          {
            role: 'user',
            content: imageUrls.map(url => ({ type: "image_url", image_url: url }))
          }
        ],
        max_tokens: 1000,
      }),
    });

    const data = await openAIResponse.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    // Parse the questionnaire answers
    const answers = JSON.parse(data.choices[0].message.content);
    console.log('Parsed answers:', answers);

    return new Response(
      JSON.stringify({ answers }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-garden-images function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});