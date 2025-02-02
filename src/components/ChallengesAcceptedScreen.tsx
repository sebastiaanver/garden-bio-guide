import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ChallengesAcceptedScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti animation
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-screen bg-garden-cream flex flex-col items-center justify-center p-4 space-y-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-garden-primary text-center">
        Congratulations!
      </h1>
      <p className="text-xl text-center max-w-md">
        Good luck with your challenges and thank you for helping improve biodiversity in your garden!
      </p>
      <Button 
        onClick={() => navigate("/")}
        className="mt-8 bg-garden-primary hover:bg-garden-secondary transition-colors"
      >
        Back to Home
      </Button>
    </div>
  );
};

export default ChallengesAcceptedScreen;