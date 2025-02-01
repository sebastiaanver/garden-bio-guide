import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json();
    console.log('Processing image URLs:', imageUrls);

    // Validate image URLs
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      console.error('Invalid or empty image URLs provided');
      return new Response(
        JSON.stringify({ error: 'No valid image URLs provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify each image URL is accessible
    try {
      console.log('Verifying image URLs accessibility...');
      await Promise.all(imageUrls.map(async (url) => {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Image URL not accessible: ${url}`);
        }
      }));
      console.log('All image URLs verified successfully');
    } catch (error) {
      console.error('Error verifying image URLs:', error);
      return new Response(
        JSON.stringify({ error: 'One or more image URLs are not accessible', details: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Initiating OpenAI analysis...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a garden biodiversity expert analyzing garden images. Your task is to assess various aspects of the garden's biodiversity and management practices. Analyze the following aspects and respond with a JSON object containing these fields:

landSize: ("small" < 500 m², "medium" 500-2000 m², "large" > 2000 m²)
landUse: ("private_garden", "agricultural", "mixed")
currentMeasures: ("yes", "no", "not_sure")
vegetationTypes: Array of ["lawn", "wildflower", "native_trees", "exotic", "vegetables", "other"]
nativeSpecies: ("mostly_native", "mixed", "mostly_non_native")
vegetationHeight: ("diverse", "some_variation", "uniform")
wildlifeFeatures: Array of ["hedgehog_house", "birdhouses", "bat_boxes", "bee_hotel", "log_piles", "none"]
waterFeatures: ("natural_pond", "man_made_pond", "no_water")
foodSources: ("year_round", "seasonally", "no")
grassManagement: ("mow_regularly", "leave_uncut", "rotational_mowing")
chemicalUse: ("frequently", "occasionally", "natural_methods")
soilHealth: ("compost", "chemical_fertilizers", "no_management")
landConnectivity: ("well_connected", "somewhat_connected", "isolated")
wildlifeBarriers: ("many_barriers", "some_barriers", "accessible")
sustainableUse: ("yes", "no")
improvements: ("actively_looking", "maybe", "satisfied")
aspectsToImprove: Array of ["wildlife_habitats", "plant_diversity", "water_retention", "reducing_pesticide", "encouraging_pollinators", "other"]

Remember to respond with a valid JSON object containing all these fields.`
          },
          ...imageUrls.map(url => ({
            role: 'user',
            content: [
              {
                type: "image_url",
                image_url: {
                  url: url,
                  detail: "high"
                }
              }
            ]
          }))
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Received OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    try {
      const content = data.choices[0].message.content;
      console.log('Parsing OpenAI response content...');
      
      const cleanContent = content.replace(/```json\n|\n```/g, '').trim();
      console.log('Cleaned content:', cleanContent);
      
      const answers = JSON.parse(cleanContent);
      console.log('Successfully parsed garden analysis:', answers);

      return new Response(
        JSON.stringify({ answers }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse garden analysis',
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
    console.error('Unexpected error in analyze-garden-images:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze garden images',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});