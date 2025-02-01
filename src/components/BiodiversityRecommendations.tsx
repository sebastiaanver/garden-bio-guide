import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export type Measure = {
  id: number;
  title: string;
  description: string;
  benefits: string;
  implementation: string;
  emoji: string;
  difficulty: number;
  impact: number;
  impactReasoning?: string;
  environmentScore?: number;
};

const measures: Measure[] = [
  {
    id: 1,
    title: "Hedgehog House",
    description: "Shelter for hedgehogs to overwinter and breed.",
    benefits: "Biodiversity, natural pest control, wildlife habitat",
    implementation: "Place in a sheltered, dry spot covered with leaves and twigs. No milk; cat food can be given if needed.",
    emoji: "🦔",
    difficulty: 2,
    impact: 4
  },
  {
    id: 2,
    title: "Plant Selection",
    description: "Using native, layered vegetation (low plants, shrubs, trees) for year-round biodiversity.",
    benefits: "Biodiversity, cooling, soil health, ecological management",
    implementation: "Use native, pollinator-friendly, and pesticide-free plants. Ensure year-round flowering.",
    emoji: "🌿",
    difficulty: 3,
    impact: 5
  },
  {
    id: 3,
    title: "Vegetable Garden",
    description: "Growing food without chemical pesticides; improving soil health.",
    benefits: "Biodiversity, soil health, sustainability",
    implementation: "Use companion planting (e.g., marigolds for pest control), compost, and crop rotation.",
    emoji: "🍅",
    difficulty: 3,
    impact: 4
  },
  {
    id: 4,
    title: "Pond",
    description: "Water feature with shallow edges for wildlife habitat and ecosystem balance.",
    benefits: "Biodiversity, water storage, ecological function",
    implementation: "Use native water plants, avoid fish to prevent nutrient overload, maintain clean edges.",
    emoji: "💧",
    difficulty: 4,
    impact: 5
  },
  {
    id: 5,
    title: "Natural Boundaries",
    description: "Using hedgerows, trees, and shrubs instead of fences for natural separation.",
    benefits: "Biodiversity, habitat connectivity, wind protection",
    implementation: "Plant mixed hedgerows with species like hawthorn, blackthorn, or willow. Avoid impermeable barriers.",
    emoji: "🌳",
    difficulty: 3,
    impact: 4
  },
  {
    id: 6,
    title: "Trees & Orchards",
    description: "Planting trees, including fruit trees, for ecosystem stability and food sources.",
    benefits: "Biodiversity, habitat, shade, carbon capture",
    implementation: "Use native trees; avoid excessive pruning. Incorporate a protective hedge around orchards.",
    emoji: "🍏",
    difficulty: 4,
    impact: 5
  },
  {
    id: 7,
    title: "Wadi & Flat Bank",
    description: "Creating water retention areas for flood control and biodiversity.",
    benefits: "Water storage, biodiversity, cooling",
    implementation: "Design for natural water drainage; plant water-tolerant species such as reeds and sedges.",
    emoji: "💦",
    difficulty: 5,
    impact: 4
  },
  {
    id: 8,
    title: "Flower Strips",
    description: "Planting native wildflower meadows to support pollinators and insects.",
    benefits: "Pollinators, biodiversity, habitat",
    implementation: "Use native wildflower seed mixes, minimize mowing, avoid fertilizers.",
    emoji: "🦋",
    difficulty: 2,
    impact: 4
  },
  {
    id: 9,
    title: "Wildlife Corners",
    description: "Leaving areas untidy (piles of wood, stones, compost) to support small animals & insects.",
    benefits: "Biodiversity, habitat, food web support",
    implementation: "Create brush piles, leave dead wood, avoid chemical treatments.",
    emoji: "🦎",
    difficulty: 1,
    impact: 3
  },
  {
    id: 10,
    title: "Phased Mowing",
    description: "Rotational mowing to allow insects and plants to thrive.",
    benefits: "Pollinators, biodiversity, soil health",
    implementation: "Mow in sections, leave some areas undisturbed. Remove cuttings to avoid over-fertilization.",
    emoji: "🌱",
    difficulty: 2,
    impact: 3
  },
  {
    id: 11,
    title: "Permeable Surfaces",
    description: "Reducing paved areas to increase soil permeability.",
    benefits: "Biodiversity, water retention, soil health",
    implementation: "Replace impermeable surfaces with gravel, grass pavers, or permeable stones.",
    emoji: "🌍",
    difficulty: 4,
    impact: 4
  },
  {
    id: 12,
    title: "Owl Nest Boxes",
    description: "Providing safe nesting sites for owls that control rodent populations.",
    benefits: "Biodiversity, natural pest control",
    implementation: "Install in barns or trees, ensure predator protection (e.g., against martens).",
    emoji: "🦉",
    difficulty: 3,
    impact: 4
  },
  {
    id: 13,
    title: "Bat Boxes",
    description: "Safe roosting spots for bats, which help control insect populations.",
    benefits: "Biodiversity, natural pest control",
    implementation: "Place boxes on buildings or trees near feeding areas (e.g., hedgerows, water bodies).",
    emoji: "🦇",
    difficulty: 2,
    impact: 4
  },
  {
    id: 14,
    title: "Birdhouses",
    description: "Nesting sites for various bird species.",
    benefits: "Biodiversity, pest control, habitat support",
    implementation: "Provide different house types for different species. Avoid placing near high-traffic areas.",
    emoji: "🐦",
    difficulty: 2,
    impact: 3
  },
  {
    id: 15,
    title: "Bee Hotels",
    description: "Nesting sites for wild bees to support pollination.",
    benefits: "Pollinators, biodiversity, food security",
    implementation: "Use untreated wood, drill holes of varying diameters, place in sunny areas.",
    emoji: "🐝",
    difficulty: 2,
    impact: 5
  }
];

interface Props {
  recommendations: number[];
  environmentScores?: Record<number, number>;
  scoreReasonings?: Record<number, string>;
}

const BiodiversityRecommendations = ({ 
  recommendations, 
  environmentScores = {}, 
  scoreReasonings = {} 
}: Props) => {
  const recommendedMeasures = measures
    .filter(measure => recommendations.includes(measure.id))
    .map(measure => ({
      ...measure,
      environmentScore: environmentScores[measure.id],
      scoreReasoning: scoreReasonings[measure.id]
    }));

  const calculateTotalPoints = (measure: Measure & { scoreReasoning?: string }) => {
    const difficultyPoints = 5 - measure.difficulty;
    const impactPoints = measure.impact;
    const environmentPoints = measure.environmentScore || 0;
    return difficultyPoints + impactPoints + environmentPoints;
  };

  return (
    <div className="space-y-6">
      <TooltipProvider delayDuration={50}>
        <Card>
          <CardHeader>
            <CardTitle>Recommended Biodiversity Measures</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {recommendedMeasures
                  .sort((a, b) => calculateTotalPoints(b) - calculateTotalPoints(a))
                  .map((measure) => (
                  <Card key={measure.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{measure.emoji}</span>
                          <CardTitle className="text-lg">{measure.title}</CardTitle>
                        </div>
                        <div className="text-muted-foreground">
                          Total Points: {calculateTotalPoints(measure)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Progress 
                        value={(calculateTotalPoints(measure) / 15) * 100} 
                        className="h-2 bg-slate-100" 
                      />
                      
                      <div className="grid grid-cols-3 gap-8">
                        <div className="space-y-2">
                          <div className="flex flex-col">
                            <span className="font-medium flex items-center justify-center gap-2">
                              Difficulty Points
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-muted-foreground transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="max-w-xs">
                                    Points awarded based on ease of implementation. Lower difficulty measures receive more points.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
                            <span className="text-2xl font-semibold text-center">{5 - measure.difficulty}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex flex-col">
                            <span className="font-medium flex items-center justify-center gap-2">
                              Impact Points
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-muted-foreground transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="max-w-xs">
                                    Points reflect the measure's potential positive effect on biodiversity.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
                            <span className="text-2xl font-semibold text-center">{measure.impact}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex flex-col">
                            <span className="font-medium flex items-center justify-center gap-2">
                              Environment Points
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-muted-foreground transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="max-w-xs">
                                    {measure.scoreReasoning || "No specific reasoning available for this environment score."}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </span>
                            <span className="text-2xl font-semibold text-center">{measure.environmentScore || 0}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-lg">{measure.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {measure.benefits.split(", ").map((benefit) => (
                          <Badge 
                            key={benefit} 
                            variant="secondary"
                            className="bg-slate-100 text-slate-900 hover:bg-slate-200"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>

                      <div className="bg-slate-50 p-6 rounded-lg space-y-2">
                        <h4 className="font-semibold text-lg">Implementation Tips</h4>
                        <p>{measure.implementation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
};

export default BiodiversityRecommendations;
