export const formatQuestionnaireForAnalysis = (
  answers: Record<string, string | string[]>,
  customAnswers: Record<string, string>
) => {
  const formattedAnswers: Record<string, any> = {};

  // Group answers by section
  Object.entries(answers).forEach(([questionId, answer]) => {
    const [section] = questionId.split('_');
    
    if (!formattedAnswers[section]) {
      formattedAnswers[section] = {};
    }
    
    formattedAnswers[section][questionId] = answer;
    
    // Add any custom answers if they exist
    if (customAnswers[questionId]) {
      formattedAnswers[section][`${questionId}_custom`] = customAnswers[questionId];
    }
  });

  return formattedAnswers;
};