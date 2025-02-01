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

    const prompt = `Based on the following garden questionnaire responses, recommend the 10 most suitable biodiversity measures. For each recommended measure, you MUST provide:
1. An environment score (1-10) indicating how well the measure fits the specific garden context
2. A difficulty score (1-10) indicating how challenging it would be to implement in this specific garden
3. An impact score (1-10) indicating the potential positive effect on biodiversity for this specific garden
4. Clear reasoning for ALL scores based on the questionnaire responses

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

You MUST return a JSON object with these properties:
1. recommendations: array of recommended measure IDs (numbers 1-15)
2. environmentScores: object mapping measure IDs to environment scores (1-10)
3. difficultyScores: object mapping measure IDs to difficulty scores (1-10)
4. impactScores: object mapping measure IDs to impact scores (1-10)
5. difficultyReasonings: object mapping measure IDs to strings explaining the difficulty score
6. impactReasonings: object mapping measure IDs to strings explaining the impact score
7. environmentReasonings: object mapping measure IDs to strings explaining how well the measure fits the environment

Example response format:
{
  "recommendations": [1, 2, 8],
  "environmentScores": {"1": 1, "2": 9, "8": 8},
  "difficultyScores": {"1": 3, "2": 6, "8": 7},
  "impactScores": {"1": 2, "2": 10, "8": 9},
  "difficultyReasonings": {
    "1": "Super difficult to implement due to the size of the garden",
    "2": "Moderate difficulty due to soil preparation needs",
    "8": "Simple to implement along existing borders"
  },
  "impactReasonings": {
    "1": "High impact as the garden lacks wildlife shelter",
    "2": "Maximum impact due to absence of native plants",
    "8": "Good impact for pollinators in sunny areas"
  },
  "environmentReasonings": {
    "1": "Well-suited for the garden's current layout and conditions",
    "2": "Perfect match for the existing soil and climate",
    "8": "Good fit for the available sunny areas"
  }
}

IMPORTANT: You MUST provide ALL reasonings (difficulty, impact, and environment) for ALL 10 recommended measure. Each reasoning MUST be a string that references specific aspects of the questionnaire responses. The response must be valid JSON with all reasonings as plain strings, not objects.`;

    console.log('Sending prompt to OpenAI:', prompt);

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a garden biodiversity expert. Analyze the questionnaire responses and return a JSON object with recommendations, scores, and specific reasoning based on the provided responses. Always provide all required reasonings for each measure."
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
    console.log('Parsed content:', content);
    
    const result = JSON.parse(content);
    console.log('Parsed result:', result);
    
    // Validate response format and ensure all reasonings are string values
    if (!Array.isArray(result.recommendations) || 
        !result.environmentScores || 
        !result.difficultyScores ||
        !result.impactScores ||
        !result.difficultyReasonings ||
        !result.impactReasonings ||
        !result.environmentReasonings) {
      console.error('Missing required fields in response:', result);
      throw new Error('Invalid response format from AI - missing required fields');
    }

    // Ensure all reasonings are strings and exist for each recommendation
    for (const id of result.recommendations) {
      if (!result.difficultyReasonings[id] || typeof result.difficultyReasonings[id] !== 'string' ||
          !result.impactReasonings[id] || typeof result.impactReasonings[id] !== 'string' ||
          !result.environmentReasonings[id] || typeof result.environmentReasonings[id] !== 'string') {
        console.error('Missing or invalid reasoning for measure:', id);
        console.error('Difficulty:', result.difficultyReasonings[id]);
        console.error('Impact:', result.impactReasonings[id]);
        console.error('Environment:', result.environmentReasonings[id]);
        throw new Error(`Invalid or missing reasoning for measure ${id}`);
      }
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