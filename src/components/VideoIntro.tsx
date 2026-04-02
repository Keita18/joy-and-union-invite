import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VideoIntroProps {
  onContinue: () => void;
}

const VideoIntro = ({ onContinue }: VideoIntroProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="relative w-full max-w-md mx-auto" style={{ paddingTop: '177.78%', maxHeight: '90vh' }}>
        <iframe
          loading="lazy"
          className="absolute inset-0 w-full h-full rounded-lg"
          src="https://www.canva.com/design/DAHFQIQgGZI/EBAu9HZ3zYBSRX222NLGwg/watch?embed"
          allowFullScreen
          allow="fullscreen"
          onLoad={() => setLoaded(true)}
        />
      </div>
      {loaded && (
        <div className="mt-6 animate-fade-in-up">
          <Button
            onClick={onContinue}
            variant="gold"
            size="lg"
            className="text-base"
          >
            Répondre à l'invitation ✉️
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoIntro;
