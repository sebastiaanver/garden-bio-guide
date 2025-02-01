export const analyzeQuestionnaire = (
  answers: Record<string, string | string[]>
): number[] => {
  const recommendations: Set<number> = new Set();

  // Analyze land size and use
  if (answers.landSize === "small" || answers.landSize === "medium") {
    recommendations.add(15); // Bee Hotels
    recommendations.add(14); // Birdhouses
  }

  // Check vegetation types
  const vegetationTypes = answers.vegetationTypes as string[];
  if (vegetationTypes?.includes("lawn")) {
    recommendations.add(10); // Phased Mowing
  }

  // Check wildlife features
  const wildlifeFeatures = answers.wildlifeFeatures as string[];
  if (!wildlifeFeatures?.includes("hedgehog_house")) {
    recommendations.add(1); // Hedgehog House
  }

  // Water features
  if (answers.waterFeatures === "no_water") {
    recommendations.add(4); // Pond
    recommendations.add(7); // Wadi & Flat Bank
  }

  // Check barriers
  if (answers.wildlifeBarriers === "many_barriers") {
    recommendations.add(5); // Natural Boundaries
    recommendations.add(11); // Permeable Surfaces
  }

  // Check aspects to improve
  const aspectsToImprove = answers.aspectsToImprove as string[];
  if (aspectsToImprove?.includes("plant_diversity")) {
    recommendations.add(2); // Plant Selection
    recommendations.add(8); // Flower Strips
  }

  if (aspectsToImprove?.includes("wildlife_habitats")) {
    recommendations.add(9); // Wildlife Corners
    recommendations.add(12); // Owl Nest Boxes
    recommendations.add(13); // Bat Boxes
  }

  return Array.from(recommendations);
};