import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
  const { toast } = useToast();

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

  const handleAcceptChallenge = async () => {
    try {
      const currentDate = new Date();
      const expiryDate = new Date(currentDate);
      expiryDate.setDate(currentDate.getDate() + 14); // Add 2 weeks

      const response = await fetch('http://localhost:8000/api/mission_instances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 2,
          created_at: currentDate.toISOString(),
          expires_at: expiryDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept challenge');
      }

      toast({
        title: "Challenge Accepted!",
        description: "You've successfully accepted the biodiversity challenge.",
      });
    } catch (error) {
      console.error('Error accepting challenge:', error);
      toast({
        title: "Error",
        description: "Failed to accept the challenge. Please try again.",
        variant: "destructive",
      });
    }
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recommended Biodiversity Measures</CardTitle>
          <Button 
            onClick={handleAcceptChallenge}
            className="bg-garden-primary hover:bg-garden-secondary transition-colors"
          >
            Accept Challenge
          </Button>
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