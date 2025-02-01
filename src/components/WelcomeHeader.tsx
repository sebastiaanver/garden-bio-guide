import { Flower2 } from "lucide-react";

const WelcomeHeader = () => {
  return (
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
  );
};

export default WelcomeHeader;