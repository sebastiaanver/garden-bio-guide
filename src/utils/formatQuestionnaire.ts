export const formatQuestionnaireForAnalysis = (
  answers: Record<string, string | string[]>,
  customAnswers: Record<string, string>
) => {
  let formattedText = "Biodiversity Assessment Results:\n\n";

  // Format each answer
  Object.entries(answers).forEach(([questionId, answer]) => {
    const section = questionId.split("_")[0];
    formattedText += `Question ID: ${questionId}\n`;
    formattedText += `Answer: ${Array.isArray(answer) ? answer.join(", ") : answer}\n`;
    if (customAnswers[questionId]) {
      formattedText += `Custom Input: ${customAnswers[questionId]}\n`;
    }
    formattedText += "\n";
  });

  return formattedText;
};