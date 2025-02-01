import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Measure } from "./types";

interface MeasureCardProps {
  measure: Measure & {
    difficultyReasoning?: string;
    impactReasoning?: string;
    environmentReasoning?: string;
    environmentScore?: number;
    difficultyScore?: number;
    impactScore?: number;
  };
  calculateTotalPoints: (measure: Measure) => number;
}

const ScoreSection = ({ 
  label, 
  score, 
  reasoning 
}: { 
  label: string; 
  score: number; 
  reasoning?: string;
}) => (
  <div className="space-y-2">
    <div className="flex flex-col">
      <span className="font-medium flex items-center justify-center gap-2">
        {label}
        {reasoning && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground/50 cursor-pointer hover:text-muted-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="max-w-xs">{reasoning}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </span>
      <span className="text-2xl font-semibold text-center">
        {score}
      </span>
    </div>
  </div>
);

const MeasureCard = ({ measure, calculateTotalPoints }: MeasureCardProps) => {
  const totalPoints = calculateTotalPoints(measure);
  const difficultyPoints = measure.difficultyScore || (5 - measure.difficulty);
  const impactPoints = measure.impactScore || measure.impact;
  const environmentPoints = measure.environmentScore || 0;

  return (
    <Card key={measure.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{measure.emoji}</span>
            <CardTitle className="text-lg">{measure.title}</CardTitle>
          </div>
          <div className="text-muted-foreground">
            Total Points: {totalPoints}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress 
          value={(totalPoints / 15) * 100} 
          className="h-2 bg-slate-100" 
        />
        
        <div className="grid grid-cols-3 gap-8">
          <ScoreSection 
            label="Difficulty Points" 
            score={difficultyPoints}
            reasoning={measure.difficultyReasoning}
          />
          <ScoreSection 
            label="Impact Points" 
            score={impactPoints}
            reasoning={measure.impactReasoning}
          />
          <ScoreSection 
            label="Environment Points" 
            score={environmentPoints}
            reasoning={measure.environmentReasoning}
          />
        </div>

        <p className="text-lg">{measure.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {measure.benefits.split(", ").map((benefit) => (
            <Badge 
              key={benefit} 
              variant="secondary"
              className="bg-slate-100 text-slate-900 hover:bg-slate-200"
            >
              {benefit}
            </Badge>
          ))}
        </div>

        <div className="bg-slate-50 p-6 rounded-lg space-y-2">
          <h4 className="font-semibold text-lg">Implementation Tips</h4>
          <p>{measure.implementation}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeasureCard;