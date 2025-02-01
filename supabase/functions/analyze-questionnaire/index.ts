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
    const { answers } = await req.json();
    console.log('Received answers:', answers);

    const prompt = `Based on the following garden questionnaire responses, recommend the most suitable biodiversity measures (return only the measure IDs 1-15 in a JSON array).

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

Return ONLY a JSON array of numbers representing the recommended measures. For example: [1, 4, 8, 15]`;

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
            content: 'You are a garden biodiversity expert. Analyze the questionnaire responses and return ONLY a JSON array of recommended measure IDs (1-15). Do not include any other text or explanation.'
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

    // Parse the response content as JSON array
    let recommendations;
    try {
      const content = data.choices[0].message.content.trim();
      recommendations = JSON.parse(content);
      
      if (!Array.isArray(recommendations)) {
        throw new Error('Response is not an array');
      }
      
      // Validate that all elements are numbers between 1 and 15
      recommendations = recommendations.filter(num => 
        typeof num === 'number' && num >= 1 && num <= 15
      );
      
      if (recommendations.length === 0) {
        throw new Error('No valid recommendations found');
      }
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      // Fallback to default recommendations
      recommendations = [1, 2, 8, 15];
    }

    return new Response(
      JSON.stringify({ recommendations }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-questionnaire function:', error);
    // Return default recommendations on error
    return new Response(
      JSON.stringify({ 
        recommendations: [1, 2, 8, 15],
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});