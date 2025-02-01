import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { measures } from "./biodiversity/measures";
import MeasureCard from "./biodiversity/MeasureCard";
import type { BiodiversityProps, Measure, ReasoningType } from "./biodiversity/types";

const BiodiversityRecommendations = ({ 
  recommendations, 
  environmentScores = {}, 
  difficultyScores = {},
  impactScores = {},
  difficultyReasonings = {},
  impactReasonings = {},
  environmentReasonings = {}
}: BiodiversityProps) => {
  console.log('Received props:', {
    recommendations,
    environmentScores,
    difficultyScores,
    impactScores,
    difficultyReasonings,
    impactReasonings,
    environmentReasonings
  });

  const calculateTotalPoints = (measure: Measure) => {
    const difficultyPoints = measure.difficultyScore || (10 - measure.difficulty);
    const impactPoints = measure.impactScore || measure.impact;
    const environmentPoints = measure.environmentScore || 0;
    return difficultyPoints + impactPoints + environmentPoints;
  };

  const recommendedMeasures = measures
    .filter(measure => recommendations.includes(measure.id))
    .map(measure => {
      const enrichedMeasure = {
        ...measure,
        environmentScore: environmentScores[measure.id],
        difficultyScore: difficultyScores[measure.id],
        impactScore: impactScores[measure.id],
        difficultyReasoning: difficultyReasonings[measure.id],
        impactReasoning: impactReasonings[measure.id],
        environmentReasoning: environmentReasonings[measure.id]
      };
      
      console.log(`Processing measure ${measure.id}:`, enrichedMeasure);
      return enrichedMeasure;
    });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommended Biodiversity Measures</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <TooltipProvider>
              <div className="space-y-6">
                {recommendedMeasures
                  .sort((a, b) => calculateTotalPoints(b) - calculateTotalPoints(a))
                  .map((measure) => (
                    <MeasureCard 
                      key={measure.id}
                      measure={measure}
                      calculateTotalPoints={calculateTotalPoints}
                    />
                  ))}
              </div>
            </TooltipProvider>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiodiversityRecommendations;