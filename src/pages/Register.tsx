import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Register = () => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as any)?.from || "/account";

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    if (form.password !== form.confirm_password) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { full_name: form.full_name.trim(), phone: form.phone.trim() } },
    });

    if (error) {
      setLoading(false);
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });

      // Send welcome email (via edge function)
      supabase.functions.invoke("send-email", {
        body: { template: "welcome", to: form.email.trim(), data: { full_name: form.full_name.trim() } },
      });
      
      setLoading(false);
      toast({ 
        title: "Code sent!", 
        description: "Please check your email for a 6-digit verification code.", 
      });
      navigate("/verify-email", { state: { email: form.email.trim() } });
    } else {
      setLoading(false);
      toast({ title: "Account created! Welcome to Switchon Tech" });
      navigate(redirectTo);
    }
  };

  const inputClass = "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SwitchOn Tech" className="h-16 w-16 rounded-xl object-cover" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground text-center mb-2">Create Account</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Join Switchon Tech today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
            <input type="text" value={form.full_name} onChange={e => update("full_name", e.target.value)} className={inputClass} placeholder="Your full name" required maxLength={100} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
            <input type="email" value={form.email} onChange={e => update("email", e.target.value)} className={inputClass} placeholder="you@email.com" required maxLength={255} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
            <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} className={inputClass} placeholder="08012345678" required maxLength={20} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password *</label>
            <input type="password" value={form.password} onChange={e => update("password", e.target.value)} className={inputClass} placeholder="Min 8 characters" required minLength={8} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password *</label>
            <input type="password" value={form.confirm_password} onChange={e => update("confirm_password", e.target.value)} className={inputClass} placeholder="Confirm your password" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity disabled:opacity-60">
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Register"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have an account? <Link to="/login" className="text-accent font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
