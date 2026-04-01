import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpeg";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast({ title: "Invalid code", description: "Please enter the 6-digit code sent to your email.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    });

    if (error) {
      setLoading(false);
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Email verified!", description: "Welcome to Switchon Tech." });
    navigate("/account");
  };

  const handleResend = async () => {
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setResending(false);

    if (error) {
      toast({ title: "Error resending code", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Code resent", description: "Check your email for the new 6-digit code." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm"
      >
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SwitchOn Tech" className="h-16 w-16 rounded-xl object-cover" />
        </div>
        
        <h1 className="text-2xl font-extrabold text-foreground text-center mb-2">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          We've sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground text-center">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full text-center text-3xl tracking-[0.5em] font-bold rounded-lg border border-border bg-background px-4 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-4 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 size={18} /> Verify Account</>}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button 
              onClick={handleResend} 
              disabled={resending}
              className="text-accent font-bold hover:underline disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend Code"}
            </button>
          </p>
          
          <Link to="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors pt-2">
            <ArrowLeft size={14} /> Back to Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
