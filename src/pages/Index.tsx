import { useState } from "react";
import { Flower2, Upload, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/components/ui/use-toast";
import BiodiversityQuestionnaire from "@/components/BiodiversityQuestionnaire";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [images, setImages] = useState<File[]>([]);
  const [selectedOption, setSelectedOption] = useState<"questionnaire" | "upload" | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
      
      // Upload images to Supabase Storage
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

          // Get the public URL for the uploaded file
          const { data: { publicUrl } } = supabase.storage
            .from('garden_images')
            .getPublicUrl(fileName);

          return publicUrl;
        })
      );

      console.log('All image URLs:', imageUrls);

      // Analyze images with edge function
      const { data, error } = await supabase.functions.invoke('analyze-garden-images', {
        body: { imageUrls }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      console.log('Analysis results:', data);

      // Pass the answers to BiodiversityQuestionnaire
      setSelectedOption("questionnaire");
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
              className="p-8 h-auto flex flex-col items-center space-y-4 bg-white hover:bg-gray-50 w-full"
              variant="outline"
            >
              <ClipboardList className="w-12 h-12 text-garden-primary" />
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Fill out Questionnaire</h3>
                <p className="text-sm text-gray-600 whitespace-normal">
                  Answer questions about your garden to receive personalized recommendations
                </p>
              </div>
            </Button>
            <Button
              onClick={() => setSelectedOption("upload")}
              className="p-8 h-auto flex flex-col items-center space-y-4 bg-white hover:bg-gray-50 w-full"
              variant="outline"
            >
              <Upload className="w-12 h-12 text-garden-primary" />
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Upload Photos</h3>
                <p className="text-sm text-gray-600 whitespace-normal">
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
            )}
            <Button
              variant="outline"
              onClick={() => {
                setSelectedOption(null);
                setImages([]);
              }}
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