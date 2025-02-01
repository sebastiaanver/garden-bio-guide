import { supabase } from "@/integrations/supabase/client";

type AnalysisResult = {
  recommendations: number[];
  environmentScores: Record<number, number>;
  scoreReasonings?: Record<number, string>;
};

type AnalysisResponse = {
  data: AnalysisResult;
  error: null | string;
};

export const analyzeQuestionnaire = async (
  answers: Record<string, string | string[]>
): Promise<AnalysisResponse> => {
  try {
    console.log('Analyzing questionnaire responses:', answers);
    
    const formattedAnswers = formatQuestionnaireForAnalysis(answers, {});
    
    const { data, error } = await supabase.functions.invoke('analyze-questionnaire', {
      body: { answers: formattedAnswers }
    });

    if (error) {
      console.error('Error calling analyze-questionnaire function:', error);
      return {
        error: error.message || 'Error analyzing questionnaire',
        data: {
          recommendations: [],
          environmentScores: {},
          scoreReasonings: {}
        }
      };
    }

    console.log('Analysis results:', data);
    return {
      error: null,
      data: {
        recommendations: data.recommendations,
        environmentScores: data.environmentScores,
        scoreReasonings: data.scoreReasonings
      }
    };
  } catch (error) {
    console.error('Error in analyzeQuestionnaire:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      data: {
        recommendations: [],
        environmentScores: {},
        scoreReasonings: {}
      }
    };
  }
};