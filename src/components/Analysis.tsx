import { useState, useEffect } from "react";
import { Leaf, TreeDeciduous, Bird } from "lucide-react";
import { Card } from "@/components/ui/card";
import { pipeline } from "@huggingface/transformers";

interface AnalysisProps {
  isLoading?: boolean;
  images?: File[];
}

const Analysis = ({ isLoading, images }: AnalysisProps) => {
  const [plantDiversity, setPlantDiversity] = useState<string>("");
  const [habitatStructure, setHabitatStructure] = useState<string>("");
  const [wildlifeSupport, setWildlifeSupport] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const analyzeImages = async () => {
      if (!images?.length || analyzing) return;
      
      setAnalyzing(true);
      console.log("Starting image analysis...");
      
      try {
        // Initialize the image classification pipeline
        const classifier = await pipeline(
          "image-classification",
          "microsoft/resnet-50",
          { quantized: true }
        );

        // Process each image
        for (const image of images) {
          const imageUrl = URL.createObjectURL(image);
          const results = await classifier(imageUrl);
          console.log("Analysis results:", results);

          // Update recommendations based on detected features
          if (results.some(r => r.label.includes("garden") || r.label.includes("plant"))) {
            setPlantDiversity("Your garden shows good plant diversity. Consider adding native flowering plants to attract more pollinators.");
          }

          if (results.some(r => r.label.includes("tree") || r.label.includes("bush"))) {
            setHabitatStructure("Your garden has good vertical structure. Adding different height levels with more shrubs could create additional wildlife habitats.");
          }

          if (results.some(r => r.label.includes("bird") || r.label.includes("insect"))) {
            setWildlifeSupport("Wildlife is present in your garden! Consider adding a water feature or bird bath to attract more species.");
          }

          URL.revokeObjectURL(imageUrl);
        }
      } catch (error) {
        console.error("Error analyzing images:", error);
        setPlantDiversity("Unable to analyze plant diversity. Please try again.");
        setHabitatStructure("Unable to analyze habitat structure. Please try again.");
        setWildlifeSupport("Unable to analyze wildlife support. Please try again.");
      } finally {
        setAnalyzing(false);
      }
    };

    analyzeImages();
  }, [images]);

  if (isLoading || analyzing) {
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
            {plantDiversity || "Analyzing plant diversity..."}
          </p>
        </Card>
        <Card className="p-4 border-garden-secondary">
          <div className="flex items-center space-x-2 mb-2">
            <TreeDeciduous className="text-garden-secondary" />
            <h3 className="font-medium">Habitat Structure</h3>
          </div>
          <p className="text-sm text-gray-600">
            {habitatStructure || "Analyzing habitat structure..."}
          </p>
        </Card>
        <Card className="p-4 border-garden-secondary">
          <div className="flex items-center space-x-2 mb-2">
            <Bird className="text-garden-secondary" />
            <h3 className="font-medium">Wildlife Support</h3>
          </div>
          <p className="text-sm text-gray-600">
            {wildlifeSupport || "Analyzing wildlife presence..."}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;