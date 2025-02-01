import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

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
    const { answers } = await req.json();
    console.log('Analyzing questionnaire answers:', answers);

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `Based on the following garden questionnaire responses, recommend the most suitable biodiversity measures. Return the response in JSON format.

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

Return a JSON object with two properties:
1. recommendations: array of recommended measure IDs (numbers 1-15)
2. environmentScores: object mapping measure IDs to environment scores (1-5)

The response must be valid JSON.`;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a garden biodiversity expert. Analyze the questionnaire responses and return a JSON object with recommendations and environment scores. Your response must be in JSON format."
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

    let result;
    try {
      const content = response.data.choices[0].message.content.trim();
      result = JSON.parse(content);
      
      // Validate and clean up the response
      if (!Array.isArray(result.recommendations) || !result.environmentScores) {
        throw new Error('Invalid response format');
      }
      
      // Ensure recommendations are valid numbers
      result.recommendations = result.recommendations.filter(id => 
        typeof id === 'number' && id >= 1 && id <= 15
      );
      
      // Ensure environment scores are valid
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
        environmentScores: { "1": 3, "2": 3, "8": 3, "15": 3 }
      };
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
      JSON.stringify({
        recommendations: [1, 2, 8, 15],
        environmentScores: { "1": 3, "2": 3, "8": 3, "15": 3 },
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});