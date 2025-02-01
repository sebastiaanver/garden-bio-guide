import { useState, useEffect } from "react";
import { Leaf, TreeDeciduous, Bird } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface AnalysisProps {
  isLoading?: boolean;
  images?: File[];
}

const Analysis = ({ isLoading, images }: AnalysisProps) => {
  const [plantDiversity, setPlantDiversity] = useState<string>("");
  const [habitatStructure, setHabitatStructure] = useState<string>("");
  const [wildlifeSupport, setWildlifeSupport] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const analyzeWithOpenAI = async (imageUrl: string, key: string) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this garden image for biodiversity. Focus on: 1) Plant diversity 2) Habitat structure 3) Wildlife support features. Provide specific recommendations for each category.",
                },
                {
                  type: "image_url",
                  image_url: imageUrl,
                },
              ],
            },
          ],
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      // Parse the analysis into our three categories
      const sections = analysis.split(/\d\)/).filter(Boolean);
      if (sections.length >= 3) {
        setPlantDiversity(sections[0].trim());
        setHabitatStructure(sections[1].trim());
        setWildlifeSupport(sections[2].trim());
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw error;
    }
  };

  const handleAnalyze = async () => {
    if (!images?.length || !apiKey) {
      toast({
        title: "Missing Requirements",
        description: "Please provide both images and an API key.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    console.log("Starting OpenAI image analysis...");

    try {
      for (const image of images) {
        const imageUrl = URL.createObjectURL(image);
        await analyzeWithOpenAI(imageUrl, apiKey);
        URL.revokeObjectURL(imageUrl);
      }

      toast({
        title: "Analysis Complete",
        description: "Your garden has been analyzed successfully!",
      });
    } catch (error) {
      console.error("Error analyzing images:", error);
      toast({
        title: "Analysis Failed",
        description: "Please check your API key and try again.",
        variant: "destructive",
      });
      setPlantDiversity("Unable to analyze plant diversity. Please try again.");
      setHabitatStructure("Unable to analyze habitat structure. Please try again.");
      setWildlifeSupport("Unable to analyze wildlife support. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

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
      <div className="flex flex-col space-y-2 max-w-md mx-auto mb-6">
        <Input
          type="password"
          placeholder="Enter your OpenAI API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full"
        />
        <Button 
          onClick={handleAnalyze}
          disabled={!apiKey || !images?.length}
          className="w-full"
        >
          Analyze Garden
        </Button>
        <p className="text-sm text-gray-500">
          Your API key is required for image analysis. It will not be stored.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-garden-primary">Garden Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-garden-secondary">
          <div className="flex items-center space-x-2 mb-2">
            <Leaf className="text-garden-secondary" />
            <h3 className="font-medium">Plant Diversity</h3>
          </div>
          <p className="text-sm text-gray-600">
            {plantDiversity || "Enter your API key and click Analyze to begin"}
          </p>
        </Card>
        <Card className="p-4 border-garden-secondary">
          <div className="flex items-center space-x-2 mb-2">
            <TreeDeciduous className="text-garden-secondary" />
            <h3 className="font-medium">Habitat Structure</h3>
          </div>
          <p className="text-sm text-gray-600">
            {habitatStructure || "Enter your API key and click Analyze to begin"}
          </p>
        </Card>
        <Card className="p-4 border-garden-secondary">
          <div className="flex items-center space-x-2 mb-2">
            <Bird className="text-garden-secondary" />
            <h3 className="font-medium">Wildlife Support</h3>
          </div>
          <p className="text-sm text-gray-600">
            {wildlifeSupport || "Enter your API key and click Analyze to begin"}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;