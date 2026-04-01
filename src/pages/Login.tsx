import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as any)?.from || "/account";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: "Invalid email or password", variant: "destructive" });
      return;
    }
    navigate(redirectTo);
  };

  const inputClass = "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SwitchOn Tech" className="h-16 w-16 rounded-xl object-cover" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground text-center mb-2">Welcome Back</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="you@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputClass} placeholder="Your password" required />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="rounded border-border" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-accent font-semibold hover:underline">Forgot Password?</Link>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity disabled:opacity-60">
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Login"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Don't have an account? <Link to="/register" className="text-accent font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
