import { useState } from "react";
import { Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import PostalCodeInput from "@/components/PostalCodeInput";
import { useToast } from "@/components/ui/use-toast";
import BiodiversityQuestionnaire from "@/components/BiodiversityQuestionnaire";
import { supabase } from "@/integrations/supabase/client";
import { analyzeQuestionnaire } from "@/utils/analyzeQuestionnaire";

const Index = () => {
  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [selectedOption, setSelectedOption] = useState<"questionnaire" | "upload" | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<number[]>([]);
  const [skipQuestionnaire, setSkipQuestionnaire] = useState(false);
  const { toast } = useToast();

  const handleImagesSelected = (files: File[]) => {
    setImages((prev) => [...prev, ...files]);
  };

  const analyzeGardenImages = async () => {
    if (images.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image of your garden",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Starting image upload process...');
      
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const fileExt = image.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          
          console.log('Attempting to upload file:', fileName);
          
          const { data, error: uploadError } = await supabase.storage
            .from('garden_images')
            .upload(fileName, image, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
          }

          console.log('Upload successful:', data);

          const { data: { publicUrl } } = supabase.storage
            .from('garden_images')
            .getPublicUrl(fileName);

          return publicUrl;
        })
      );

      console.log('All image URLs:', imageUrls);

      const { data, error } = await supabase.functions.invoke('analyze-garden-images', {
        body: { imageUrls }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      console.log('Analysis results:', data);

      const recommendedMeasures = await analyzeQuestionnaire(data.answers);
      console.log('Generated recommendations:', recommendedMeasures);
      
      setRecommendations(recommendedMeasures);
      setSkipQuestionnaire(true);

    } catch (error) {
      console.error('Error analyzing garden:', error);
      toast({
        title: "Analysis Error",
        description: "There was an error analyzing your garden images. Please try again or use the questionnaire instead.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStart = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue",
        variant: "destructive",
      });
      return;
    }

    if (!postalCode || postalCode.length !== 6) {
      toast({
        title: "Invalid postal code",
        description: "Please enter a valid postal code (e.g., 1234AB)",
        variant: "destructive",
      });
      return;
    }

    if (!selectedOption) {
      toast({
        title: "Select an option",
        description: "Please choose whether you want to fill out the questionnaire or upload photos",
        variant: "destructive",
      });
      return;
    }

    setShowForm(false);
  };

  if (!showForm && selectedOption === "upload") {
    return (
      <div className="min-h-screen bg-garden-cream">
        <div className="px-4 py-8 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-garden-primary">
              Welcome, {name}!
            </h2>
            <p className="text-gray-600">
              Upload photos of your garden for analysis
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-lg shadow-sm">
            {!skipQuestionnaire ? (
              <div className="space-y-6">
                <ImageUpload onImagesSelected={handleImagesSelected} />
                <Button
                  onClick={analyzeGardenImages}
                  className="w-full bg-garden-primary hover:bg-garden-secondary transition-colors"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Analyzing your garden...</span>
                    </div>
                  ) : (
                    "Analyze Garden"
                  )}
                </Button>
              </div>
            ) : (
              <BiodiversityQuestionnaire 
                skipQuestionnaire={true} 
                initialRecommendations={recommendations}
              />
            )}
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(true);
                setImages([]);
                setSkipQuestionnaire(false);
                setRecommendations([]);
                setSelectedOption(null);
              }}
              className="mt-4"
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!showForm && selectedOption === "questionnaire") {
    return (
      <div className="min-h-screen bg-garden-cream">
        <div className="px-4 py-8 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-garden-primary">
              Welcome, {name}!
            </h2>
            <p className="text-gray-600">
              Let's assess your garden's biodiversity
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-lg shadow-sm">
            <BiodiversityQuestionnaire />
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(true);
                setSelectedOption(null);
              }}
              className="mt-4"
            >
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="max-w-6xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <PostalCodeInput
              value={postalCode}
              onChange={setPostalCode}
            />
          </div>

          <div className="space-y-4">
            <Label>Choose an option:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <Button
                  variant={selectedOption === "questionnaire" ? "default" : "outline"}
                  className={`w-full p-8 h-auto flex flex-col items-center space-y-4 ${
                    selectedOption === "questionnaire" ? "bg-garden-primary" : ""
                  }`}
                  onClick={() => setSelectedOption("questionnaire")}
                >
                  <span className="text-xl font-semibold">Fill Questionnaire</span>
                  <p className="text-sm opacity-80">
                    Answer questions about your garden's features and management practices to receive personalized recommendations.
                  </p>
                </Button>
              </div>

              <div className="relative">
                <Button
                  variant={selectedOption === "upload" ? "default" : "outline"}
                  className={`w-full p-8 h-auto flex flex-col items-center space-y-4 ${
                    selectedOption === "upload" ? "bg-garden-primary" : ""
                  }`}
                  onClick={() => setSelectedOption("upload")}
                >
                  <span className="text-xl font-semibold">Upload Photos</span>
                  <p className="text-sm opacity-80">
                    Upload photos of your garden and let our AI analyze them to provide tailored biodiversity recommendations.
                  </p>
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleStart}
            className="w-full bg-garden-primary hover:bg-garden-secondary transition-colors mt-8"
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
