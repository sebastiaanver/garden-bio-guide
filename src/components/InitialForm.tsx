import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PostalCodeInput from "@/components/PostalCodeInput";
import { useToast } from "@/components/ui/use-toast";

interface InitialFormProps {
  name: string;
  setName: (name: string) => void;
  postalCode: string;
  setPostalCode: (code: string) => void;
  selectedOption: "questionnaire" | "upload" | null;
  setSelectedOption: (option: "questionnaire" | "upload" | null) => void;
  onSubmit: () => void;
}

const InitialForm = ({
  name,
  setName,
  postalCode,
  setPostalCode,
  selectedOption,
  setSelectedOption,
  onSubmit,
}: InitialFormProps) => {
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue",
        variant: "destructive",
      });
      return;
    }

    if (!postalCode || postalCode.length !== 6) {
      toast({
        title: "Invalid postal code",
        description: "Please enter a valid postal code (e.g., 1234AB)",
        variant: "destructive",
      });
      return;
    }

    if (!selectedOption) {
      toast({
        title: "Select an option",
        description: "Please choose whether you want to fill out the questionnaire or upload photos",
        variant: "destructive",
      });
      return;
    }

    onSubmit();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-left">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <PostalCodeInput
            value={postalCode}
            onChange={setPostalCode}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-left">Choose an option:</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <Button
              variant={selectedOption === "questionnaire" ? "default" : "outline"}
              className={`w-full p-8 h-auto flex flex-col items-start space-y-4 whitespace-normal ${
                selectedOption === "questionnaire" ? "bg-garden-primary" : ""
              }`}
              onClick={() => setSelectedOption("questionnaire")}
            >
              <div className="flex items-center w-full">
                <FileText className="w-6 h-6 mr-2" />
                <span className="text-xl font-semibold break-words text-left">Fill Questionnaire</span>
              </div>
              <p className="text-sm opacity-80 break-words text-left">
                Answer questions about your garden's features and management practices to receive personalized recommendations.
              </p>
            </Button>
          </div>

          <div className="relative">
            <Button
              variant={selectedOption === "upload" ? "default" : "outline"}
              className={`w-full p-8 h-auto flex flex-col items-start space-y-4 whitespace-normal ${
                selectedOption === "upload" ? "bg-garden-primary" : ""
              }`}
              onClick={() => setSelectedOption("upload")}
            >
              <div className="flex items-center w-full">
                <Upload className="w-6 h-6 mr-2" />
                <span className="text-xl font-semibold break-words text-left">Upload Photos</span>
              </div>
              <p className="text-sm opacity-80 break-words text-left">
                Upload photos of your garden and let our AI analyze them to provide tailored biodiversity recommendations.
              </p>
            </Button>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-garden-primary hover:bg-garden-secondary transition-colors mt-8"
      >
        Start
      </Button>
    </div>
  );
};

export default InitialForm;