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
            content: `You are a garden biodiversity expert analyzing garden images. Respond ONLY with a JSON object containing questionnaire answers. Do not include any markdown formatting, explanation text, or code blocks. The response should be a valid JSON object with these exact keys and valid values from the questionnaire options:

{
  "landSize": "small" | "medium" | "large",
  "landUse": "private_garden" | "agricultural" | "mixed",
  "currentMeasures": "yes" | "no" | "not_sure",
  "vegetationTypes": string[],
  "nativeSpecies": "mostly_native" | "mixed" | "mostly_non_native",
  "vegetationHeight": "diverse" | "some_variation" | "uniform",
  "wildlifeFeatures": string[],
  "waterFeatures": "natural_pond" | "man_made_pond" | "no_water",
  "foodSources": "year_round" | "seasonally" | "no",
  "grassManagement": "mow_regularly" | "leave_uncut" | "rotational_mowing",
  "chemicalUse": "frequently" | "occasionally" | "natural_methods",
  "soilHealth": "compost" | "chemical_fertilizers" | "no_management",
  "landConnectivity": "well_connected" | "somewhat_connected" | "isolated",
  "wildlifeBarriers": "many_barriers" | "some_barriers" | "accessible",
  "sustainableUse": "yes" | "no",
  "improvements": "actively_looking" | "maybe" | "satisfied",
  "aspectsToImprove": string[]
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
        temperature: 0.3,
        response_format: { type: "json_object" }
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
      const content = data.choices[0].message.content;
      console.log('Content to parse:', content);
      
      // Remove any potential markdown formatting
      const cleanContent = content.replace(/```json\n|\n```/g, '').trim();
      console.log('Cleaned content:', cleanContent);
      
      const answers = JSON.parse(cleanContent);
      console.log('Successfully parsed answers:', answers);

      return new Response(
        JSON.stringify({ answers }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw content that failed to parse:', data.choices[0].message.content);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse OpenAI response',
          details: parseError.message,
          content: data.choices[0].message.content 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
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