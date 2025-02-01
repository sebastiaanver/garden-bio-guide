import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    console.log('Received answers:', answers);

    const prompt = `Based on the following garden questionnaire responses, recommend the most suitable biodiversity measures. For each recommended measure:
1. Provide an impact score (1-5 scale, where 5 is highest impact)
2. Provide a brief explanation of why you assigned that impact score

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

Return a JSON object with three properties:
1. recommendations: array of recommended measure IDs
2. environmentScores: object mapping measure IDs to environment scores (1-5)
3. impactReasonings: object mapping measure IDs to objects containing:
   - score: impact score (1-5)
   - reasoning: brief explanation for the score

Example response:
{
  "recommendations": [1, 4, 8, 15],
  "environmentScores": {
    "1": 4,
    "4": 3,
    "8": 5,
    "15": 4
  },
  "impactReasonings": {
    "1": {
      "score": 4,
      "reasoning": "Hedgehogs are excellent natural pest controllers and their presence indicates a healthy ecosystem"
    },
    "4": {
      "score": 5,
      "reasoning": "A pond provides essential habitat for amphibians and insects, significantly boosting biodiversity"
    }
  }
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a garden biodiversity expert. Analyze the questionnaire responses and return a JSON object with recommendations, environment scores, and impact reasonings.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    let result;
    try {
      const content = data.choices[0].message.content.trim();
      result = JSON.parse(content);
      
      if (!Array.isArray(result.recommendations) || !result.environmentScores || !result.impactReasonings) {
        throw new Error('Invalid response format');
      }
      
      // Validate and clean up the response
      result.recommendations = result.recommendations.filter(id => 
        typeof id === 'number' && id >= 1 && id <= 15
      );
      
      result.environmentScores = Object.fromEntries(
        Object.entries(result.environmentScores)
          .filter(([id, score]) => 
            result.recommendations.includes(Number(id)) &&
            typeof score === 'number' &&
            score >= 1 &&
            score <= 5
          )
      );
      
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      result = {
        recommendations: [1, 2, 8, 15],
        environmentScores: { "1": 3, "2": 3, "8": 3, "15": 3 },
        impactReasonings: {
          "1": { score: 4, reasoning: "Provides shelter for beneficial wildlife" },
          "2": { score: 5, reasoning: "Foundation for biodiversity" },
          "8": { score: 4, reasoning: "Supports essential pollinators" },
          "15": { score: 5, reasoning: "Critical for wild bee populations" }
        }
      };
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-questionnaire function:', error);
    return new Response(
      JSON.stringify({ 
        recommendations: [1, 2, 8, 15],
        environmentScores: { "1": 3, "2": 3, "8": 3, "15": 3 },
        impactReasonings: {
          "1": { score: 4, reasoning: "Provides shelter for beneficial wildlife" },
          "2": { score: 5, reasoning: "Foundation for biodiversity" },
          "8": { score: 4, reasoning: "Supports essential pollinators" },
          "15": { score: 5, reasoning: "Critical for wild bee populations" }
        },
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});