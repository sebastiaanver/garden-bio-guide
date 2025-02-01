import { Leaf, TreeDeciduous, Bird } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AnalysisProps {
  isLoading?: boolean;
}

const Analysis = ({ isLoading }: AnalysisProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-garden-primary">Garden Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-garden-secondary">
          <div className="flex items-center space-x-2 mb-2">
            <Leaf className="text-garden-secondary" />
            <h3 className="font-medium">Plant Diversity</h3>
          </div>
          <p className="text-sm text-gray-600">
            Your garden shows good plant diversity. Consider adding native flowering plants to attract more pollinators.
          </p>
        </Card>
        <Card className="p-4 border-garden-secondary">
          <div className="flex items-center space-x-2 mb-2">
            <TreeDeciduous className="text-garden-secondary" />
            <h3 className="font-medium">Habitat Structure</h3>
          </div>
          <p className="text-sm text-gray-600">
            Adding different height levels with shrubs and small trees could create more wildlife habitats.
          </p>
        </Card>
        <Card className="p-4 border-garden-secondary">
          <div className="flex items-center space-x-2 mb-2">
            <Bird className="text-garden-secondary" />
            <h3 className="font-medium">Wildlife Support</h3>
          </div>
          <p className="text-sm text-gray-600">
            Consider adding a water feature or bird bath to attract more wildlife to your garden.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;