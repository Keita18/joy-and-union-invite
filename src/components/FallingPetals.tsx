import { useEffect, useState } from "react";
import rosePetals from "@/assets/rose-petals-corner.png";

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  swayAmount: number;
}

const FallingPetals = ({ count = 12 }: { count?: number }) => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        size: 18 + Math.random() * 22,
        rotation: Math.random() * 360,
        swayAmount: 30 + Math.random() * 60,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute animate-[fall_linear_infinite]"
          style={{
            left: `${p.left}%`,
            top: "-40px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationName: "fall",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          <img
            src={rosePetals}
            alt=""
            className="animate-[sway_ease-in-out_infinite_alternate]"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              transform: `rotate(${p.rotation}deg)`,
              opacity: 0.5,
              animationDuration: `${p.duration / 2}s`,
              animationName: "sway",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
              // @ts-ignore
              "--sway": `${p.swayAmount}px`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FallingPetals;
