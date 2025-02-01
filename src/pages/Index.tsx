import { useState } from "react";
import { Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";
import PostalCodeInput from "@/components/PostalCodeInput";
import Analysis from "@/components/Analysis";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [images, setImages] = useState<File[]>([]);
  const [postalCode, setPostalCode] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImagesSelected = (files: File[]) => {
    setImages((prev) => [...prev, ...files]);
  };

  const isValidPostalCode = (code: string) => {
    const postalCodeRegex = /^[0-9]{4}[A-Z]{2}$/;
    return postalCodeRegex.test(code);
  };

  const analyzeGarden = () => {
    if (images.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image of your garden",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPostalCode(postalCode)) {
      toast({
        title: "Invalid postal code",
        description: "Please enter a valid postal code (e.g., 1234AB)",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-garden-cream">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Flower2 className="w-12 h-12 text-garden-primary" />
          </div>
          <h1 className="text-4xl font-bold text-garden-primary">Garden Biodiversity Analyzer</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload photos of your garden and discover ways to enhance its biodiversity. Get personalized recommendations based on your location and current garden composition.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-lg shadow-sm">
          <ImageUpload onImagesSelected={handleImagesSelected} />
          
          <div className="space-y-4">
            <PostalCodeInput value={postalCode} onChange={setPostalCode} />
            
            <Button
              onClick={analyzeGarden}
              className="bg-garden-primary hover:bg-garden-secondary transition-colors"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Garden"}
            </Button>
          </div>

          {(showAnalysis || isAnalyzing) && (
            <Analysis isLoading={isAnalyzing} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;