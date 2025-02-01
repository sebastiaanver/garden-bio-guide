import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export type Measure = {
  id: number;
  title: string;
  description: string;
  benefits: string;
  implementation: string;
  emoji: string;
};

const measures: Measure[] = [
  {
    id: 1,
    title: "Hedgehog House",
    description: "Shelter for hedgehogs to overwinter and breed.",
    benefits: "Biodiversity, natural pest control, wildlife habitat",
    implementation: "Place in a sheltered, dry spot covered with leaves and twigs. No milk; cat food can be given if needed.",
    emoji: "🦔"
  },
  // ... Add all other measures here
];

interface Props {
  recommendations: number[]; // Array of measure IDs
}

const BiodiversityRecommendations = ({ recommendations }: Props) => {
  const recommendedMeasures = measures.filter(measure => 
    recommendations.includes(measure.id)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommended Biodiversity Measures</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {recommendedMeasures.map((measure) => (
                <Card key={measure.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{measure.emoji}</span>
                      <CardTitle className="text-lg">{measure.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{measure.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {measure.benefits.split(", ").map((benefit) => (
                        <Badge key={benefit} variant="secondary">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Implementation Tips</h4>
                      <p className="text-sm">{measure.implementation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiodiversityRecommendations;