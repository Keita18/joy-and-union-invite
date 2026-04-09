import { useState } from "react";
import VideoIntro from "@/components/VideoIntro";
import RSVPForm from "@/components/RSVPForm";

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return <VideoIntro onContinue={() => setShowForm(true)} />;
  }

  return <RSVPForm />;
};

export default Index;
