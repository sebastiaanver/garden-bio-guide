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

    const prompt = `Based on the following garden questionnaire responses, recommend the most suitable biodiversity measures. For each recommended measure, provide:
1. An environment score (1-5) indicating how well the measure fits the specific garden context
2. A difficulty score (1-5) indicating how challenging it would be to implement in this specific garden
3. An impact score (1-5) indicating the potential positive effect on biodiversity for this specific garden
4. Clear reasoning for all scores based on the questionnaire responses

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

Return a JSON object with these properties:
1. recommendations: array of recommended measure IDs (numbers 1-15)
2. environmentScores: object mapping measure IDs to environment scores (1-5)
3. difficultyScores: object mapping measure IDs to difficulty scores (1-5)
4. impactScores: object mapping measure IDs to impact scores (1-5)
5. difficultyReasonings: object mapping measure IDs to strings explaining the difficulty score
6. impactReasonings: object mapping measure IDs to strings explaining the impact score

Example response format:
{
  "recommendations": [1, 2, 8],
  "environmentScores": {"1": 4, "2": 5, "8": 3},
  "difficultyScores": {"1": 2, "2": 3, "8": 2},
  "impactScores": {"1": 4, "2": 5, "8": 4},
  "difficultyReasonings": {
    "1": "Easy to implement given the sheltered area mentioned",
    "2": "Moderate difficulty due to soil preparation needs",
    "8": "Simple to implement along existing borders"
  },
  "impactReasonings": {
    "1": "High impact as the garden lacks wildlife shelter",
    "2": "Maximum impact due to absence of native plants",
    "8": "Good impact for pollinators in sunny areas"
  }
}

Provide detailed, specific reasonings that reference the actual questionnaire responses.
The response must be valid JSON.`;

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a garden biodiversity expert. Analyze the questionnaire responses and return a JSON object with recommendations, scores, and specific reasoning based on the provided responses."
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
        !result.difficultyScores ||
        !result.impactScores ||
        !result.difficultyReasonings ||
        !result.impactReasonings) {
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