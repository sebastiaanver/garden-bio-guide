import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
            Return a JSON object with the questionnaire answers, formatted exactly like this example:
            {
              "landSize": "medium",
              "landUse": "residential",
              "currentMeasures": ["native_plants", "bird_feeders"],
              "vegetationTypes": ["trees", "shrubs", "flowers"],
              "nativeSpecies": "medium",
              "vegetationHeight": "mixed",
              "wildlifeFeatures": ["bird_nests", "insect_hotels"],
              "waterFeatures": "none",
              "foodSources": ["natural", "supplementary"],
              "grassManagement": "regular_mowing",
              "chemicalUse": "none",
              "soilHealth": "good",
              "landConnectivity": "partial",
              "wildlifeBarriers": ["fences"],
              "improvements": ["add_pond", "more_native_plants"],
              "aspectsToImprove": ["biodiversity", "wildlife_support"]
            }`
          },
          {
            role: 'user',
            content: [
              ...imageUrls.map(url => ({
                type: "image_url",
                image_url: {
                  url: url,
                  detail: "high"
                }
              }))
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await openAIResponse.json();
    console.log('OpenAI raw response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    try {
      // Parse the response content as JSON
      const answers = JSON.parse(data.choices[0].message.content.trim());
      console.log('Parsed answers:', answers);

      return new Response(
        JSON.stringify({ answers }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw content that failed to parse:', data.choices[0].message.content);
      throw new Error('Failed to parse OpenAI response as JSON');
    }
  } catch (error) {
    console.error('Error in analyze-garden-images function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});