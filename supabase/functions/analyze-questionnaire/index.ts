import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers } = await req.json();
    console.log('Analyzing questionnaire answers:', answers);

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `Based on the following garden questionnaire responses, recommend the most suitable biodiversity measures. For each recommended measure, provide a score (1-5) indicating how well it fits the specific environment, along with clear reasoning for the score.

Questionnaire Responses:
${JSON.stringify(answers, null, 2)}

Available measures:
1 = Hedgehog House
2 = Plant Selection
3 = Vegetable Garden
4 = Pond
5 = Natural Boundaries
6 = Trees & Orchards
7 = Wadi & Flat Bank
8 = Flower Strips
9 = Wildlife Corners
10 = Phased Mowing
11 = Permeable Surfaces
12 = Owl Nest Boxes
13 = Bat Boxes
14 = Birdhouses
15 = Bee Hotels

Measures details:
#	Measure	Description	Key Benefits	Implementation Highlights
1	Hedgehog House	Shelter for hedgehogs to overwinter and breed.	🦔 Biodiversity, natural pest control, wildlife habitat	Place in a sheltered, dry spot covered with leaves and twigs. No milk; cat food can be given if needed.
2	Plant Selection	Using native, layered vegetation (low plants, shrubs, trees) for year-round biodiversity.	🌿 Biodiversity, cooling, soil health, ecological management	Use native, pollinator-friendly, and pesticide-free plants. Ensure year-round flowering.
3	Vegetable Garden	Growing food without chemical pesticides; improving soil health.	🍅 Biodiversity, soil health, sustainability	Use companion planting (e.g., marigolds for pest control), compost, and crop rotation.
4	Pond	Water feature with shallow edges for wildlife habitat and ecosystem balance.	💧 Biodiversity, water storage, ecological function	Use native water plants, avoid fish to prevent nutrient overload, maintain clean edges.
5	Natural Boundaries	Using hedgerows, trees, and shrubs instead of fences for natural separation.	🌳 Biodiversity, habitat connectivity, wind protection	Plant mixed hedgerows with species like hawthorn, blackthorn, or willow. Avoid impermeable barriers.
6	Trees & Orchards	Planting trees, including fruit trees, for ecosystem stability and food sources.	🍏 Biodiversity, habitat, shade, carbon capture	Use native trees; avoid excessive pruning. Incorporate a protective hedge around orchards.
7	Wadi & Flat Bank	Creating water retention areas for flood control and biodiversity.	💦 Water storage, biodiversity, cooling	Design for natural water drainage; plant water-tolerant species such as reeds and sedges.
8	Flower Strips	Planting native wildflower meadows to support pollinators and insects.	🦋 Pollinators, biodiversity, habitat	Use native wildflower seed mixes, minimize mowing, avoid fertilizers.
9	Wildlife Corners	Leaving areas untidy (piles of wood, stones, compost) to support small animals & insects.	🦎 Biodiversity, habitat, food web support	Create brush piles, leave dead wood, avoid chemical treatments.
10	Phased Mowing	Rotational mowing to allow insects and plants to thrive.	🌱 Pollinators, biodiversity, soil health	Mow in sections, leave some areas undisturbed. Remove cuttings to avoid over-fertilization.
11	Permeable Surfaces	Reducing paved areas to increase soil permeability.	🌍 Biodiversity, water retention, soil health	Replace impermeable surfaces with gravel, grass pavers, or permeable stones.
12	Owl Nest Boxes	Providing safe nesting sites for owls that control rodent populations.	🦉 Biodiversity, natural pest control	Install in barns or trees, ensure predator protection (e.g., against martens).
13	Bat Boxes	Safe roosting spots for bats, which help control insect populations.	🦇 Biodiversity, natural pest control	Place boxes on buildings or trees near feeding areas (e.g., hedgerows, water bodies).
14	Birdhouses	Nesting sites for various bird species.	🐦 Biodiversity, pest control, habitat support	Provide different house types for different species. Avoid placing near high-traffic areas.
15	Bee Hotels	Nesting sites for wild bees to support pollination.	🐝 Pollinators, biodiversity, food security	Use untreated wood, drill holes of varying diameters, place in sunny areas.

Return a JSON object with three properties:
1. recommendations: array of recommended measure IDs (numbers 1-15)
2. environmentScores: object mapping measure IDs to environment scores (1-5)
3. scoreReasonings: object mapping measure IDs to strings explaining the specific reasoning for each environment score based on the questionnaire responses

Example response format:
{
  "recommendations": [1, 2, 8],
  "environmentScores": {"1": 4, "2": 5, "8": 3},
  "scoreReasonings": {
    "1": "Based on the garden size of 200m² and existing hedges, this would provide excellent shelter for hedgehogs",
    "2": "The south-facing aspect and well-draining soil make this location perfect for native plant diversity",
    "8": "Limited space but good sun exposure allows for effective wildflower strips along borders"
  }
}

Provide detailed, specific reasonings that reference the actual questionnaire responses.
The response must be valid JSON.`;

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a garden biodiversity expert. Analyze the questionnaire responses and return a JSON object with recommendations, environment scores, and specific reasoning based on the provided responses. Your response must be in JSON format."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    console.log('OpenAI response:', response.data);

    if (!response.data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const content = response.data.choices[0].message.content.trim();
    const result = JSON.parse(content);
    
    // Validate response format
    if (!Array.isArray(result.recommendations) || 
        !result.environmentScores || 
        !result.scoreReasonings) {
      throw new Error('Invalid response format from AI');
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in analyze-questionnaire function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});