import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Heart, Send } from "lucide-react";

const RSVPForm = () => {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<string>("");
  const [accompanied, setAccompanied] = useState<string>("");
  const [companionNames, setCompanionNames] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !attending) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    if (name.trim().length > 100) {
      toast.error("Le nom est trop long");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("guest_responses").insert({
      name: name.trim().slice(0, 100),
      attending: attending === "yes",
      accompanied: accompanied === "yes",
      companion_names: accompanied === "yes" ? companionNames.trim().slice(0, 500) : null,
      message: message.trim().slice(0, 1000) || null,
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
          <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
            Merci {name} !
          </h2>
          <p className="text-muted-foreground text-lg">
            {attending === "yes"
              ? "Nous avons hâte de vous voir ! 🎉"
              : "Nous sommes désolés que vous ne puissiez pas venir. 💕"}
          </p>
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
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">RSVP</h1>
          <p className="text-muted-foreground">Confirmez votre présence</p>
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
              Seriez-vous des nôtres ? <span className="text-destructive">*</span>
            </Label>
            <RadioGroup value={attending} onValueChange={setAttending} className="flex gap-4">
              <div className="flex items-center space-x-2 bg-background px-4 py-3 rounded-xl border border-border cursor-pointer hover:border-gold transition-colors flex-1">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="cursor-pointer text-foreground">Oui, avec plaisir ! 🎉</Label>
              </div>
              <div className="flex items-center space-x-2 bg-background px-4 py-3 rounded-xl border border-border cursor-pointer hover:border-gold transition-colors flex-1">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="cursor-pointer text-foreground">Non, malheureusement 😢</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Accompanied */}
          {attending === "yes" && (
            <div className="space-y-3 animate-fade-in-up">
              <Label className="text-foreground font-medium">Seriez-vous accompagné(e) ?</Label>
              <RadioGroup value={accompanied} onValueChange={setAccompanied} className="flex gap-4">
                <div className="flex items-center space-x-2 bg-background px-4 py-3 rounded-xl border border-border cursor-pointer hover:border-gold transition-colors flex-1">
                  <RadioGroupItem value="yes" id="acc-yes" />
                  <Label htmlFor="acc-yes" className="cursor-pointer text-foreground">Oui</Label>
                </div>
                <div className="flex items-center space-x-2 bg-background px-4 py-3 rounded-xl border border-border cursor-pointer hover:border-gold transition-colors flex-1">
                  <RadioGroupItem value="no" id="acc-no" />
                  <Label htmlFor="acc-no" className="cursor-pointer text-foreground">Non</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Companion Names */}
          {attending === "yes" && accompanied === "yes" && (
            <div className="space-y-2 animate-fade-in-up">
              <Label htmlFor="companions" className="text-foreground font-medium">
                Nom(s) des accompagnateur(s)
              </Label>
              <Input
                id="companions"
                value={companionNames}
                onChange={(e) => setCompanionNames(e.target.value)}
                placeholder="Ex: Marie Dupont, Pierre Martin"
                maxLength={500}
                className="bg-background"
              />
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground font-medium">
              Un mot pour les futurs mariés <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Félicitations, vœux de bonheur..."
              maxLength={1000}
              rows={3}
              className="bg-background resize-none"
            />
          </div>

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
