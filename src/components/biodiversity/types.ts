export type Measure = {
  id: number;
  title: string;
  description: string;
  benefits: string;
  implementation: string;
  emoji: string;
  difficulty: number;
  impact: number;
  impactReasoning?: string;
  difficultyReasoning?: string;
  environmentScore?: number;
  difficultyScore?: number;
  impactScore?: number;
};

export type ReasoningType = string | { _type: string; value: string };

export interface BiodiversityProps {
  recommendations: number[];
  environmentScores?: Record<number, number>;
  difficultyScores?: Record<number, number>;
  impactScores?: Record<number, number>;
  difficultyReasonings?: Record<number, ReasoningType>;
  impactReasonings?: Record<number, ReasoningType>;
  environmentReasonings?: Record<number, ReasoningType>;
}