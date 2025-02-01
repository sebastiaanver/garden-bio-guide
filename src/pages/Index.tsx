import { useState } from "react";
import WelcomeHeader from "@/components/WelcomeHeader";
import InitialForm from "@/components/InitialForm";
import PhotoUploadView from "@/components/PhotoUploadView";
import QuestionnaireView from "@/components/QuestionnaireView";

const Index = () => {
  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [selectedOption, setSelectedOption] = useState<"questionnaire" | "upload" | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleStartOver = () => {
    setShowForm(true);
    setSelectedOption(null);
  };

  if (!showForm && selectedOption === "upload") {
    return (
      <div className="min-h-screen bg-garden-cream">
        <PhotoUploadView 
          name={name}
          onStartOver={handleStartOver}
        />
      </div>
    );
  }

  if (!showForm && selectedOption === "questionnaire") {
    return (
      <div className="min-h-screen bg-garden-cream">
        <QuestionnaireView 
          name={name}
          onStartOver={handleStartOver}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-garden-cream">
      <div className="px-4 py-8 space-y-8">
        <WelcomeHeader />
        <InitialForm
          name={name}
          setName={setName}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onSubmit={() => setShowForm(false)}
        />
      </div>
    </div>
  );
};

export default Index;