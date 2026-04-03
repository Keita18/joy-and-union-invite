import { useState } from "react";
import VideoIntro from "@/components/VideoIntro";
import RSVPForm from "@/components/RSVPForm";
import FallingPetals from "@/components/FallingPetals";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <FallingPetals count={14} />
      {!showForm ? (
        <VideoIntro onContinue={() => setShowForm(true)} />
      ) : (
        <RSVPForm />
      )}
    </>
  );
};

export default Index;
