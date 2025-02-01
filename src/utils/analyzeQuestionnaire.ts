import { supabase } from "@/integrations/supabase/client";
import { formatQuestionnaireForAnalysis } from './formatQuestionnaire';

export const analyzeQuestionnaire = async (
  answers: Record<string, string | string[]>
): Promise<number[]> => {
  try {
    console.log('Analyzing questionnaire responses:', answers);
    
    // Format the questionnaire responses
    const formattedAnswers = formatQuestionnaireForAnalysis(answers, {});
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-questionnaire', {
      body: { answers: formattedAnswers }
    });

    if (error) {
      console.error('Error calling analyze-questionnaire function:', error);
      throw error;
    }

    console.log('Analysis results:', data);
    return data.recommendations;
  } catch (error) {
    console.error('Error in analyzeQuestionnaire:', error);
    // Fallback to basic recommendations if analysis fails
    return [1, 2, 8, 15];
  }
};