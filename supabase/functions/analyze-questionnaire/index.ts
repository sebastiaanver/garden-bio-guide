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
    
    // Format the questionnaire data for GPT analysis
    let prompt = `Analyze the following garden questionnaire responses and recommend the most suitable biodiversity measures (return only the measure IDs 1-15).
    Consider factors like land size, current features, and user preferences.
    
    Questionnaire Responses:
    ${JSON.stringify(answers, null, 2)}
    
    Based on these responses, return a JSON array containing only the IDs of the recommended measures (1-15).
    For example: [1, 4, 8, 15]
    
    Remember:
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
    15 = Bee Hotels`;

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
            content: 'You are an expert in biodiversity and garden ecology. Analyze questionnaire responses and recommend appropriate biodiversity measures. Only respond with a JSON array of measure IDs.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', data);

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Extract the recommendations array from the response
    const recommendationsText = data.choices[0].message.content;
    const recommendations = JSON.parse(recommendationsText);

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-questionnaire function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});