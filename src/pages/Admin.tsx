import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Lock, Users, UserCheck, UserX, MessageSquare, LogOut, Heart, User } from "lucide-react";

interface GuestResponse {
  id: string;
  name: string;
  attending: boolean;
  accompanied: boolean;
  companion_names: string | null;
  message: string | null;
  created_at: string;
}

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<GuestResponse[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Identifiants incorrects");
    } else {
      setAuthenticated(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
    setResponses([]);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setAuthenticated(true);
    });
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const fetchResponses = async () => {
      const { data, error } = await supabase
        .from("guest_responses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Erreur lors du chargement des réponses");
      } else {
        setResponses(data || []);
      }
    };
    fetchResponses();
  }, [authenticated]);

  const attending = responses.filter((r) => r.attending);
  const notAttending = responses.filter((r) => !r.attending);
  const couples = attending.filter((r) => r.accompanied);
  const solos = attending.filter((r) => !r.accompanied);
  const totalGuests = attending.reduce((acc, r) => acc + (r.accompanied ? 2 : 1), 0);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 mx-auto text-gold mb-4" />
            <h1 className="font-display text-3xl font-bold text-foreground">Admin</h1>
            <p className="text-muted-foreground mt-1">Espace organisateur</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 bg-card p-6 rounded-2xl border border-border">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-background" />
            </div>
            <Button type="submit" variant="gold" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Tableau de bord</h1>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-3xl font-bold text-foreground">{totalGuests}</p>
              <p className="text-muted-foreground text-sm">Total invités</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6 text-center">
              <UserCheck className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <p className="text-3xl font-bold text-foreground">{attending.length}</p>
              <p className="text-muted-foreground text-sm">Présents</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6 text-center">
              <UserX className="w-8 h-8 mx-auto text-destructive mb-2" />
              <p className="text-3xl font-bold text-foreground">{notAttending.length}</p>
              <p className="text-muted-foreground text-sm">Absents</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6 text-center">
              <Heart className="w-8 h-8 mx-auto text-pink-500 mb-2" />
              <p className="text-3xl font-bold text-foreground">{couples.length}</p>
              <p className="text-muted-foreground text-sm">En couple</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6 text-center">
              <User className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <p className="text-3xl font-bold text-foreground">{solos.length}</p>
              <p className="text-muted-foreground text-sm">Seul(e)</p>
            </CardContent>
          </Card>
        </div>

        {/* Responses */}
        <div className="space-y-4">
          {responses.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Aucune réponse pour le moment</p>
          ) : (
            responses.map((r) => (
              <Card key={r.id} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-display text-foreground">{r.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={r.attending ? "default" : "destructive"} className={r.attending ? "bg-green-600 text-green-50" : ""}>
                        {r.attending ? "Présent" : "Absent"}
                      </Badge>
                      {r.attending && (
                        <Badge variant="outline" className="text-xs">
                          {r.accompanied ? "En couple 💕" : "Seul(e) 😉"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {r.accompanied && r.companion_names && (
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Accompagnateur(s) :</strong> {r.companion_names}
                    </p>
                  )}
                  {r.message && (
                    <div className="flex items-start gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                      <p className="text-muted-foreground italic">"{r.message}"</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
