import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VideoIntroProps {
  onContinue: () => void;
}

const VideoIntro = ({ onContinue }: VideoIntroProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-sm flex-1 max-h-[85vh]">
        <iframe
          loading="lazy"
          className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
          src="https://www.canva.com/design/DAHFQIQgGZI/EBAu9HZ3zYBSRX222NLGwg/watch?embed"
          allowFullScreen
          allow="fullscreen"
          onLoad={() => setLoaded(true)}
        />
      </div>
      {loaded && (
        <div className="mt-6 animate-fade-in-up shrink-0">
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
