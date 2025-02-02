const analyzeWithGPT = async (formattedAnswers: string): Promise<number[]> => {
  try {
    console.log("Analyzing answers with GPT-4o:", formattedAnswers);
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a biodiversity expert. Analyze the questionnaire responses and recommend appropriate measures from a list of 15 possible measures. Return ONLY the measure IDs as a JSON array. Available measures are numbered 1-13 and include options like Hedgehog House (1), Vegetable Garden (3), etc.

Consider factors like:
- Land size and use
- Current vegetation and wildlife features
- Management practices
- Future plans and improvements desired

Respond with only the array of recommended measure IDs, e.g. [1, 4, 8, 15]`
          },
          {
            role: "user",
            content: formattedAnswers
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    const data = await response.json();
    console.log("GPT-4o response:", data);

    if (data.error) {
      console.error("OpenAI API error:", data.error);
      throw new Error(data.error.message);
    }

    // Parse the response to get the array of measure IDs
    const recommendedMeasures = JSON.parse(data.choices[0].message.content);
    return recommendedMeasures;
  } catch (error) {
    console.error("Error analyzing with GPT:", error);
    // Return a default set of recommendations if the API call fails
    return [1, 2, 8, 15];
  }
};

export { analyzeWithGPT };