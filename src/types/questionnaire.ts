export type QuestionOption = {
  label: string;
  value: string;
  allowCustom?: boolean;
};

export type Question = {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: QuestionOption[];
  section: string;
};

export type Section = {
  id: string;
  title: string;
  questions: Question[];
};