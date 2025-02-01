import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { questionnaireSections } from "@/data/questionnaire";
import { Question } from "@/types/questionnaire";
import { analyzeQuestionnaire } from "@/utils/analyzeQuestionnaire";
import BiodiversityRecommendations from "./BiodiversityRecommendations";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Flower2 } from "lucide-react";

const BiodiversityQuestionnaire = () => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleSingleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultipleAnswer = (questionId: string, value: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentAnswers = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, value] };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((v) => v !== value),
        };
      }
    });
  };

  const handleCustomAnswer = (questionId: string, value: string) => {
    setCustomAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    console.log("Final answers:", { answers, customAnswers });
    setIsAnalyzing(true);
    
    try {
      const recommendedMeasures = await analyzeQuestionnaire(answers);
      setRecommendations(recommendedMeasures);
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error analyzing questionnaire:", error);
      toast({
        title: "Analysis Error",
        description: "There was an error analyzing your responses. Using default recommendations instead.",
        variant: "destructive",
      });
      setRecommendations([1, 2, 8, 15]);
      setShowRecommendations(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (showRecommendations) {
    return <BiodiversityRecommendations recommendations={recommendations} />;
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 min-h-[400px]">
        <div className="relative">
          <Flower2 className="w-16 h-16 text-garden-secondary animate-spin" />
          <div className="absolute inset-0 animate-pulse bg-garden-cream/20 rounded-full" />
        </div>
        <p className="text-lg text-garden-primary animate-pulse">
          Analyzing your garden's biodiversity...
        </p>
        <p className="text-sm text-gray-600">
          Creating personalized recommendations for your garden
        </p>
      </div>
    );
  }

  const currentSectionData = questionnaireSections[currentSection];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{currentSectionData.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentSectionData.questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <h3 className="font-medium">{question.text}</h3>
              {renderQuestion(question)}
            </div>
          ))}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
              disabled={currentSection === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentSection < questionnaireSections.length - 1) {
                  setCurrentSection((prev) => prev + 1);
                } else {
                  handleSubmit();
                }
              }}
            >
              {currentSection === questionnaireSections.length - 1
                ? "Submit"
                : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiodiversityQuestionnaire;