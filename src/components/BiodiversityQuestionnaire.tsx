import { useState, useEffect } from "react";
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

interface BiodiversityQuestionnaireProps {
  initialRecommendations?: number[];
  initialDifficultyScores?: Record<number, number>;
  initialImpactScores?: Record<number, number>;
  initialEnvironmentScores?: Record<number, number>;
  initialDifficultyReasonings?: Record<number, string>;
  initialImpactReasonings?: Record<number, string>;
  initialEnvironmentReasonings?: Record<number, string>;
  skipQuestionnaire?: boolean;
}

const BiodiversityQuestionnaire = ({ 
  initialRecommendations,
  initialDifficultyScores,
  initialImpactScores,
  initialEnvironmentScores,
  initialDifficultyReasonings,
  initialImpactReasonings,
  initialEnvironmentReasonings,
  skipQuestionnaire = false 
}: BiodiversityQuestionnaireProps) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<number[]>([]);
  const [environmentScores, setEnvironmentScores] = useState<Record<number, number>>({});
  const [difficultyScores, setDifficultyScores] = useState<Record<number, number>>({});
  const [impactScores, setImpactScores] = useState<Record<number, number>>({});
  const [difficultyReasonings, setDifficultyReasonings] = useState<Record<number, string>>({});
  const [impactReasonings, setImpactReasonings] = useState<Record<number, string>>({});
  const [environmentReasonings, setEnvironmentReasonings] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (skipQuestionnaire && initialRecommendations) {
      setRecommendations(initialRecommendations);
      setShowRecommendations(true);
      setDifficultyScores(initialDifficultyScores);
      setImpactScores(initialImpactScores);
      setEnvironmentScores(initialEnvironmentScores);
      setDifficultyReasonings(initialDifficultyReasonings);
      setImpactReasonings(initialImpactReasonings);
      setEnvironmentReasonings(initialEnvironmentReasonings);
    }
  }, [skipQuestionnaire, initialRecommendations, initialDifficultyScores, initialImpactScores, initialEnvironmentScores, initialDifficultyReasonings, initialImpactReasonings, initialEnvironmentReasonings]);

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
      const result = await analyzeQuestionnaire(answers);
      if (result.error) {
        throw new Error(result.error);
      }
      setRecommendations(result.data.recommendations);
      setEnvironmentScores(result.data.environmentScores);
      setDifficultyScores(result.data.difficultyScores);
      setImpactScores(result.data.impactScores);
      if (result.data.difficultyReasonings) {
        setDifficultyReasonings(result.data.difficultyReasonings);
      }
      if (result.data.impactReasonings) {
        setImpactReasonings(result.data.impactReasonings);
      }
      if (result.data.environmentReasonings) {
        setEnvironmentReasonings(result.data.environmentReasonings);
      }
      setShowRecommendations(true);
    } catch (error) {
      console.error("Error analyzing questionnaire:", error);
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "There was an error analyzing your responses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderQuestion = (question: Question) => {
    if (question.type === "single") {
      return (
        <div className="space-y-2">
          {question.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${question.id}-${option.value}`}
                name={question.id}
                value={option.value}
                checked={(answers[question.id] as string) === option.value}
                onChange={(e) => handleSingleAnswer(question.id, e.target.value)}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor={`${question.id}-${option.value}`} className="text-sm">
                {option.label}
              </label>
              {option.allowCustom && answers[question.id] === option.value && (
                <Input
                  className="ml-2 w-48"
                  placeholder="Please specify"
                  value={customAnswers[question.id] || ""}
                  onChange={(e) => handleCustomAnswer(question.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {question.options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${question.id}-${option.value}`}
              checked={(answers[question.id] as string[] || []).includes(option.value)}
              onCheckedChange={(checked) =>
                handleMultipleAnswer(question.id, option.value, checked as boolean)
              }
            />
            <label htmlFor={`${question.id}-${option.value}`} className="text-sm">
              {option.label}
            </label>
            {option.allowCustom &&
              (answers[question.id] as string[] || []).includes(option.value) && (
                <Input
                  className="ml-2 w-48"
                  placeholder="Please specify"
                  value={customAnswers[question.id] || ""}
                  onChange={(e) => handleCustomAnswer(question.id, e.target.value)}
                />
              )}
          </div>
        ))}
      </div>
    );
  };

  if (showRecommendations) {
    return <BiodiversityRecommendations 
      recommendations={recommendations}
      environmentScores={environmentScores}
      difficultyScores={difficultyScores}
      impactScores={impactScores}
      difficultyReasonings={difficultyReasonings}
      impactReasonings={impactReasonings}
      environmentReasonings={environmentReasonings}
    />;
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