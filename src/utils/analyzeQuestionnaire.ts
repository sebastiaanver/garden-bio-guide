import { supabase } from "@/integrations/supabase/client";
import { formatQuestionnaireForAnalysis } from './formatQuestionnaire';

export const analyzeQuestionnaire = async (
  answers: Record<string, string | string[]>
): Promise<{ recommendations: number[], environmentScores: Record<number, number> }> => {
  try {
    console.log('Analyzing questionnaire responses:', answers);
    
    const formattedAnswers = formatQuestionnaireForAnalysis(answers, {});
    
    const { data, error } = await supabase.functions.invoke('analyze-questionnaire', {
      body: { answers: formattedAnswers }
    });

    if (error) {
      console.error('Error calling analyze-questionnaire function:', error);
      throw error;
    }

    console.log('Analysis results:', data);
    return {
      recommendations: data.recommendations,
      environmentScores: data.environmentScores
    };
  } catch (error) {
    console.error('Error in analyzeQuestionnaire:', error);
    return {
      recommendations: [1, 2, 8, 15],
      environmentScores: { "1": 3, "2": 3, "8": 3, "15": 3 }
    };
  }
};