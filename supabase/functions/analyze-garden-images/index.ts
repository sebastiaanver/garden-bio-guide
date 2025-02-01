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

    // Validate image URLs
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      console.error('Invalid or empty image URLs provided');
      return new Response(
        JSON.stringify({ error: 'No valid image URLs provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify each image URL is accessible before sending to OpenAI
    try {
      await Promise.all(imageUrls.map(async (url) => {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Image URL not accessible: ${url}`);
        }
      }));
    } catch (error) {
      console.error('Error verifying image URLs:', error);
      return new Response(
        JSON.stringify({ error: 'One or more image URLs are not accessible', details: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('All image URLs verified, proceeding with OpenAI analysis');

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
            content: `You are a garden biodiversity expert analyzing garden images. Your task is to assess various aspects of the garden's biodiversity and management practices. Here's what each field means:

1. landSize: Approximate size of the land
   - "small": Less than 500 m²
   - "medium": 500 m² - 2000 m²
   - "large": More than 2000 m²

2. landUse: Main purpose of the land
   - "private_garden": Residential garden
   - "agricultural": Farming/cultivation
   - "mixed": Combined garden and small-scale farming

3. currentMeasures: Whether biodiversity promotion measures are visible
   - "yes": Clear evidence of biodiversity measures
   - "no": No visible biodiversity measures
   - "not_sure": Unclear from images

4. vegetationTypes: Types of plants present (array of strings)
   Possible values: ["lawn", "wildflower", "native_trees", "exotic", "vegetables", "other"]

5. nativeSpecies: Presence of native plant species
   - "mostly_native": Predominantly native plants
   - "mixed": Mix of native and non-native
   - "mostly_non_native": Mainly non-native species

6. vegetationHeight: Vertical diversity of vegetation
   - "diverse": Multiple distinct layers
   - "some_variation": Some height differences
   - "uniform": Mostly single-level vegetation

7. wildlifeFeatures: Wildlife-supporting structures (array of strings)
   Possible values: ["hedgehog_house", "birdhouses", "bat_boxes", "bee_hotel", "log_piles", "none"]

8. waterFeatures: Presence of water bodies
   - "natural_pond": Natural water feature
   - "man_made_pond": Artificial pond/water feature
   - "no_water": No visible water features

9. foodSources: Availability of wildlife food
   - "year_round": Constant food sources
   - "seasonally": Seasonal food availability
   - "no": No visible food sources

10. grassManagement: Lawn maintenance approach
    - "mow_regularly": Frequently mowed
    - "leave_uncut": Some areas left natural
    - "rotational_mowing": Varied mowing patterns

11. chemicalUse: Use of chemical treatments
    - "frequently": Regular chemical use evident
    - "occasionally": Some chemical use
    - "natural_methods": Natural/organic approach

12. soilHealth: Soil management practices
    - "compost": Organic matter/composting visible
    - "chemical_fertilizers": Chemical fertilizer use
    - "no_management": No visible soil management

13. landConnectivity: Connection to other natural areas
    - "well_connected": Links to other green spaces
    - "somewhat_connected": Partial connectivity
    - "isolated": No visible connections

14. wildlifeBarriers: Obstacles to wildlife movement
    - "many_barriers": Significant barriers
    - "some_barriers": Some passable barriers
    - "accessible": Few/no barriers

15. sustainableUse: Sustainable practices visible
    - "yes": Clear sustainable practices
    - "no": No visible sustainable practices

16. improvements: Potential for biodiversity enhancement
    - "actively_looking": Clear room for improvement
    - "maybe": Some potential improvements
    - "satisfied": Already well-optimized

17. aspectsToImprove: Areas needing enhancement (array of strings)
    Possible values: ["wildlife_habitats", "plant_diversity", "water_retention", "reducing_pesticide", "encouraging_pollinators", "other"]

For each recommendation you make, also provide an impact score (1-5) and reasoning for that score.

Analyze the provided garden images and respond ONLY with a JSON object containing these fields plus impact scores and reasoning. Do not include any markdown formatting or explanation text.`
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
          error: 'Failed to parse OpenAI response as JSON',
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