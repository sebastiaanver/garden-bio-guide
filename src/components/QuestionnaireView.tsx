import { Button } from "@/components/ui/button";
import BiodiversityQuestionnaire from "@/components/BiodiversityQuestionnaire";

interface QuestionnaireViewProps {
  name: string;
  onStartOver: () => void;
}

const QuestionnaireView = ({ name, onStartOver }: QuestionnaireViewProps) => {
  return (
    <div className="px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-garden-primary">
          Welcome, {name}!
        </h2>
        <p className="text-gray-600">
          Let's assess your garden's biodiversity
        </p>
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        <BiodiversityQuestionnaire />
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

export default QuestionnaireView;