import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Heart, Send } from "lucide-react";
import roseTopLeft from "@/assets/rose-top-left.png";
import rosePetals from "@/assets/rose-petals.png";
import roseBottomRight from "@/assets/rose-bottom-right.png";

const FloralDecor = () => (
  <>
    <img src={roseTopLeft} alt="" className="absolute top-0 left-0 w-36 h-36 opacity-30 -rotate-12 pointer-events-none" loading="lazy" width={512} height={512} />
    <img src={rosePetals} alt="" className="absolute top-0 right-0 w-48 h-48 opacity-20 pointer-events-none" loading="lazy" width={512} height={512} />
    <img src={roseBottomRight} alt="" className="absolute bottom-0 right-0 w-44 h-44 opacity-25 rotate-12 pointer-events-none" loading="lazy" width={512} height={512} />
    <img src={rosePetals} alt="" className="absolute bottom-0 left-0 w-40 h-40 opacity-15 rotate-180 pointer-events-none" loading="lazy" width={512} height={512} />
  </>
);
const RSVPForm = () => {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<string>("");
  const [companionType, setCompanionType] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !attending) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("guest_responses").insert({
      name: name.trim().slice(0, 100),
      attending: attending === "yes",
      accompanied: attending === "yes" && companionType === "couple",
      companion_names: null,
      message: null,
    });

    setSubmitting(false);
    if (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } else {
      setSubmitted(true);
      toast.success("Merci pour votre réponse !");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
        <FloralDecor />
        <div className="text-center animate-fade-in-up max-w-md relative z-10">
          <Heart className="w-16 h-16 mx-auto text-primary mb-6" fill="hsl(var(--rose))" />
          {attending === "yes" ? (
            <>
              <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
                Merci !
              </h2>
              <p className="text-muted-foreground text-lg">
                Nous avons hâte de partager cette journée avec vous 🥂
              </p>
              <p className="text-muted-foreground mt-2">
                Les invitations officielles suivront très bientôt.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
                Dommage que vous ne puissiez pas être avec nous !
              </h2>
              <p className="text-muted-foreground text-lg">
                Merci de nous accompagner par vos pensées et vos prières en ce jour si spécial 💛
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <FloralDecor />
      <div className="w-full max-w-lg animate-fade-in-up relative z-10">
        <div className="text-center mb-10">
          <Heart className="w-10 h-10 mx-auto text-primary mb-4" />
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">RSVP</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Nous espérons vivement vous avoir à nos côtés pour célébrer ce moment unique.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-2xl border border-border shadow-sm">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              Votre nom complet <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Prénom et Nom"
              maxLength={100}
              required
              className="bg-background"
            />
          </div>

          {/* Attending */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">
              Serez-vous des nôtres ? <span className="text-destructive">*</span>
            </Label>
            <RadioGroup value={attending} onValueChange={setAttending} className="flex gap-4">
              <div className="flex items-center space-x-2 bg-background px-4 py-3 rounded-xl border border-border cursor-pointer hover:border-primary transition-colors flex-1">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="cursor-pointer text-foreground">Oui, avec plaisir 🎉</Label>
              </div>
              <div className="flex items-center space-x-2 bg-background px-4 py-3 rounded-xl border border-border cursor-pointer hover:border-primary transition-colors flex-1">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="cursor-pointer text-foreground">Non, malheureusement 😔</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Companion type */}
          {attending === "yes" && (
            <div className="space-y-3 animate-fade-in-up">
              <Label className="text-foreground font-medium">Serez-vous :</Label>
              <RadioGroup value={companionType} onValueChange={setCompanionType} className="flex gap-4">
                <div className="flex items-center space-x-2 bg-background px-4 py-3 rounded-xl border border-border cursor-pointer hover:border-primary transition-colors flex-1">
                  <RadioGroupItem value="couple" id="couple" />
                  <Label htmlFor="couple" className="cursor-pointer text-foreground">En couple 💕</Label>
                </div>
                <div className="flex items-center space-x-2 bg-background px-4 py-3 rounded-xl border border-border cursor-pointer hover:border-primary transition-colors flex-1">
                  <RadioGroupItem value="solo" id="solo" />
                  <Label htmlFor="solo" className="cursor-pointer text-foreground">Seul(e) / singleton 😉</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button type="submit" variant="gold" size="lg" className="w-full text-base" disabled={submitting}>
            {submitting ? "Envoi en cours..." : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer ma réponse
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RSVPForm;
