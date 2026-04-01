import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const defaultSettings: Record<string, string> = {
  business_name: "Switchon Tech - Complete ICT Center",
  phone1: "08050624942",
  phone2: "",
  email: "info@switchontech.com",
  address: "Gbagada, Lagos, Nigeria",
  opening_hours: "Mon-Sat: 9AM - 6PM",
  facebook_url: "",
  instagram_url: "",
  whatsapp_number: "2348050624942",
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const map = { ...defaultSettings };
        data.forEach((row: any) => { if (row.key in map) map[row.key] = row.value || ""; });
        setSettings(map);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    }
    setSaving(false);
    toast({ title: "Settings saved successfully" });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPw) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPwLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated successfully" });
    setPassword("");
    setConfirmPw("");
  };

  const update = (key: string, value: string) => setSettings((s) => ({ ...s, [key]: value }));
  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50";

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-accent" size={28} /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Business Info */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-foreground">Business Information</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Business Name</label>
          <input value={settings.business_name} onChange={(e) => update("business_name", e.target.value)} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone 1</label>
            <input value={settings.phone1} onChange={(e) => update("phone1", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone 2</label>
            <input value={settings.phone2} onChange={(e) => update("phone2", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <input value={settings.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Address</label>
          <input value={settings.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Opening Hours</label>
          <input value={settings.opening_hours} onChange={(e) => update("opening_hours", e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Social */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-foreground">Social Media Links</h2>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Facebook URL</label>
          <input value={settings.facebook_url} onChange={(e) => update("facebook_url", e.target.value)} className={inputClass} placeholder="https://facebook.com/..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Instagram URL</label>
          <input value={settings.instagram_url} onChange={(e) => update("instagram_url", e.target.value)} className={inputClass} placeholder="https://instagram.com/..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">WhatsApp Number</label>
          <input value={settings.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} className={inputClass} placeholder="2348012345678" />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] disabled:opacity-60">
        {saving ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Save Settings"}
      </button>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-foreground">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className={inputClass} placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={pwLoading} className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] disabled:opacity-60">
            {pwLoading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
