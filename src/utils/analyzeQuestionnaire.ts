import { analyzeWithGPT } from './openai';
import { formatQuestionnaireForAnalysis } from './formatQuestionnaire';

export const analyzeQuestionnaire = async (
  answers: Record<string, string | string[]>
): Promise<number[]> => {
  try {
    // Format the questionnaire responses for GPT analysis
    const formattedAnswers = formatQuestionnaireForAnalysis(answers, {});
    
    // Get recommendations from GPT-4o
    const recommendations = await analyzeWithGPT(formattedAnswers);
    
    return recommendations;
  } catch (error) {
    console.error("Error in analyzeQuestionnaire:", error);
    // Fallback to basic recommendations if GPT analysis fails
    return [1, 2, 8, 15];
  }
};