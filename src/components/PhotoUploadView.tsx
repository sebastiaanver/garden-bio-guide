import { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";
import BiodiversityQuestionnaire from "@/components/BiodiversityQuestionnaire";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzeQuestionnaire } from "@/utils/analyzeQuestionnaire";

interface PhotoUploadViewProps {
  name: string;
  onStartOver: () => void;
}

const PhotoUploadView = ({ name, onStartOver }: PhotoUploadViewProps) => {
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
        images.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          
          console.log('Attempting to upload file:', fileName, 'Size:', file.size);
          
          const maxRetries = 3;
          let attempt = 0;
          
          while (attempt < maxRetries) {
            try {
              const { data, error: uploadError } = await supabase.storage
                .from('garden_images')
                .upload(fileName, file, {
                  cacheControl: '3600',
                  upsert: false
                });

              if (uploadError) {
                console.error(`Upload error (attempt ${attempt + 1}):`, uploadError);
                attempt++;
                if (attempt === maxRetries) throw uploadError;
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                continue;
              }

              console.log('Upload successful:', data);

              const { data: { publicUrl } } = supabase.storage
                .from('garden_images')
                .getPublicUrl(fileName);

              const response = await fetch(publicUrl, { method: 'HEAD' });
              if (!response.ok) {
                throw new Error(`Image URL not accessible: ${publicUrl}`);
              }

              return publicUrl;
            } catch (error) {
              console.error(`Attempt ${attempt + 1} failed:`, error);
              attempt++;
              if (attempt === maxRetries) throw error;
              await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
          }
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
      
      if (recommendedMeasures.error) {
        throw new Error(recommendedMeasures.error);
      }

      setRecommendations(recommendedMeasures.data.recommendations);
      setSkipQuestionnaire(true);

    } catch (error) {
      console.error('Error analyzing garden:', error);
      toast({
        title: "Analysis Error",
        description: "There was an error processing your garden images. Please try uploading smaller images or use the questionnaire instead.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-garden-primary">
          Welcome, {name}!
        </h2>
        <p className="text-gray-600">
          Upload photos of your garden for analysis
        </p>
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
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
          onClick={onStartOver}
          className="mt-4"
        >
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default PhotoUploadView;