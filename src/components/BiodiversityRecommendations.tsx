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
  {
    id: 2,
    title: "Plant Selection",
    description: "Using native, layered vegetation (low plants, shrubs, trees) for year-round biodiversity.",
    benefits: "Biodiversity, cooling, soil health, ecological management",
    implementation: "Use native, pollinator-friendly, and pesticide-free plants. Ensure year-round flowering.",
    emoji: "🌿"
  },
  {
    id: 3,
    title: "Vegetable Garden",
    description: "Growing food without chemical pesticides; improving soil health.",
    benefits: "Biodiversity, soil health, sustainability",
    implementation: "Use companion planting (e.g., marigolds for pest control), compost, and crop rotation.",
    emoji: "🍅"
  },
  {
    id: 4,
    title: "Pond",
    description: "Water feature with shallow edges for wildlife habitat and ecosystem balance.",
    benefits: "Biodiversity, water storage, ecological function",
    implementation: "Use native water plants, avoid fish to prevent nutrient overload, maintain clean edges.",
    emoji: "💧"
  },
  {
    id: 5,
    title: "Natural Boundaries",
    description: "Using hedgerows, trees, and shrubs instead of fences for natural separation.",
    benefits: "Biodiversity, habitat connectivity, wind protection",
    implementation: "Plant mixed hedgerows with species like hawthorn, blackthorn, or willow. Avoid impermeable barriers.",
    emoji: "🌳"
  },
  {
    id: 6,
    title: "Trees & Orchards",
    description: "Planting trees, including fruit trees, for ecosystem stability and food sources.",
    benefits: "Biodiversity, habitat, shade, carbon capture",
    implementation: "Use native trees; avoid excessive pruning. Incorporate a protective hedge around orchards.",
    emoji: "🍏"
  },
  {
    id: 7,
    title: "Wadi & Flat Bank",
    description: "Creating water retention areas for flood control and biodiversity.",
    benefits: "Water storage, biodiversity, cooling",
    implementation: "Design for natural water drainage; plant water-tolerant species such as reeds and sedges.",
    emoji: "💦"
  },
  {
    id: 8,
    title: "Flower Strips",
    description: "Planting native wildflower meadows to support pollinators and insects.",
    benefits: "Pollinators, biodiversity, habitat",
    implementation: "Use native wildflower seed mixes, minimize mowing, avoid fertilizers.",
    emoji: "🦋"
  },
  {
    id: 9,
    title: "Wildlife Corners",
    description: "Leaving areas untidy (piles of wood, stones, compost) to support small animals & insects.",
    benefits: "Biodiversity, habitat, food web support",
    implementation: "Create brush piles, leave dead wood, avoid chemical treatments.",
    emoji: "🦎"
  },
  {
    id: 10,
    title: "Phased Mowing",
    description: "Rotational mowing to allow insects and plants to thrive.",
    benefits: "Pollinators, biodiversity, soil health",
    implementation: "Mow in sections, leave some areas undisturbed. Remove cuttings to avoid over-fertilization.",
    emoji: "🌱"
  },
  {
    id: 11,
    title: "Permeable Surfaces",
    description: "Reducing paved areas to increase soil permeability.",
    benefits: "Biodiversity, water retention, soil health",
    implementation: "Replace impermeable surfaces with gravel, grass pavers, or permeable stones.",
    emoji: "🌍"
  },
  {
    id: 12,
    title: "Owl Nest Boxes",
    description: "Providing safe nesting sites for owls that control rodent populations.",
    benefits: "Biodiversity, natural pest control",
    implementation: "Install in barns or trees, ensure predator protection (e.g., against martens).",
    emoji: "🦉"
  },
  {
    id: 13,
    title: "Bat Boxes",
    description: "Safe roosting spots for bats, which help control insect populations.",
    benefits: "Biodiversity, natural pest control",
    implementation: "Place boxes on buildings or trees near feeding areas (e.g., hedgerows, water bodies).",
    emoji: "🦇"
  },
  {
    id: 14,
    title: "Birdhouses",
    description: "Nesting sites for various bird species.",
    benefits: "Biodiversity, pest control, habitat support",
    implementation: "Provide different house types for different species. Avoid placing near high-traffic areas.",
    emoji: "🐦"
  },
  {
    id: 15,
    title: "Bee Hotels",
    description: "Nesting sites for wild bees to support pollination.",
    benefits: "Pollinators, biodiversity, food security",
    implementation: "Use untreated wood, drill holes of varying diameters, place in sunny areas.",
    emoji: "🐝"
  }
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