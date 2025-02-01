import { useState } from "react";
import { Flower2, Upload, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";
import PostalCodeInput from "@/components/PostalCodeInput";
import Analysis from "@/components/Analysis";
import { useToast } from "@/components/ui/use-toast";
import BiodiversityQuestionnaire from "@/components/BiodiversityQuestionnaire";

const Index = () => {
  const [images, setImages] = useState<File[]>([]);
  const [postalCode, setPostalCode] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"questionnaire" | "upload" | null>(null);
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
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAnalysis(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-garden-cream">
      <div className="px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Flower2 className="w-12 h-12 text-garden-primary" />
          </div>
          <h1 className="text-4xl font-bold text-garden-primary">
            Garden Biodiversity Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Assess your garden's biodiversity and get personalized recommendations to enhance it.
          </p>
        </div>

        {!selectedOption ? (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 px-4">
            <Button
              onClick={() => setSelectedOption("questionnaire")}
              className="p-8 h-auto flex flex-col items-center space-y-4 bg-white hover:bg-gray-50 relative overflow-hidden"
              variant="outline"
            >
              <ClipboardList className="w-12 h-12 text-garden-primary" />
              <div className="text-center px-4">
                <h3 className="font-semibold text-lg mb-2">Fill out Questionnaire</h3>
                <p className="text-sm text-gray-600 break-words">
                  Answer questions about your garden to receive personalized recommendations
                </p>
              </div>
            </Button>
            <Button
              disabled
              className="p-8 h-auto flex flex-col items-center space-y-4 bg-white relative overflow-hidden"
              variant="outline"
            >
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="text-center px-4">
                <h3 className="font-semibold text-lg text-gray-400 mb-2">
                  Upload Photos (Coming Soon)
                </h3>
                <p className="text-sm text-gray-400 break-words">
                  Let AI analyze your garden photos and provide recommendations
                </p>
              </div>
            </Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-lg shadow-sm">
            {selectedOption === "questionnaire" ? (
              <BiodiversityQuestionnaire />
            ) : (
              <>
                <ImageUpload onImagesSelected={handleImagesSelected} />
                <PostalCodeInput value={postalCode} onChange={setPostalCode} />
                <Button
                  onClick={analyzeGarden}
                  className="bg-garden-primary hover:bg-garden-secondary transition-colors"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Garden"}
                </Button>
                {(showAnalysis || isAnalyzing) && <Analysis isLoading={isAnalyzing} />}
              </>
            )}
            <Button
              variant="outline"
              onClick={() => setSelectedOption(null)}
              className="mt-4"
            >
              Back to Options
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;