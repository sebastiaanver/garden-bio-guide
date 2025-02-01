import { supabase } from "@/integrations/supabase/client";
import { formatQuestionnaireForAnalysis } from './formatQuestionnaire';

type AnalysisResult = {
  recommendations: number[];
  environmentScores: Record<number, number>;
  difficultyScores: Record<number, number>;
  impactScores: Record<number, number>;
  difficultyReasonings?: Record<number, string>;
  impactReasonings?: Record<number, string>;
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
          difficultyScores: {},
          impactScores: {},
          difficultyReasonings: {},
          impactReasonings: {}
        }
      };
    }

    console.log('Analysis results:', data);
    return {
      error: null,
      data: {
        recommendations: data.recommendations,
        environmentScores: data.environmentScores,
        difficultyScores: data.difficultyScores,
        impactScores: data.impactScores,
        difficultyReasonings: data.difficultyReasonings,
        impactReasonings: data.impactReasonings
      }
    };
  } catch (error) {
    console.error('Error in analyzeQuestionnaire:', error);
    return {
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      data: {
        recommendations: [],
        environmentScores: {},
        difficultyScores: {},
        impactScores: {},
        difficultyReasonings: {},
        impactReasonings: {}
      }
    };
  }
};