import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
    toast({ title: "Reset link sent! Check your email." });
  };

  const inputClass = "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SwitchOn Tech" className="h-16 w-16 rounded-xl object-cover" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground text-center mb-2">Forgot Password</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter your email and we'll send you a reset link
        </p>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
              A password reset link has been sent to your email. Please check your inbox.
            </div>
            <Link to="/login" className="text-accent font-semibold hover:underline text-sm">
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="you@email.com" required />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Send Reset Link"}
            </button>
            <p className="text-sm text-muted-foreground text-center">
              <Link to="/login" className="text-accent font-semibold hover:underline">← Back to Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
