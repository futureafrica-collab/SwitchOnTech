import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Download } from "lucide-react";

const NewsletterManager = () => {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubs = async () => {
    setLoading(true);
    const { data } = await supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false });
    setSubs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchSubs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Subscriber removed" });
    fetchSubs();
  };

  const exportCSV = () => {
    const csv = ["Email,Date Subscribed", ...subs.map((s) => `${s.email},${s.subscribed_at || ""}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter_subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Newsletter Subscribers</h2>
          <p className="text-sm text-muted-foreground">{subs.length} total subscriber(s)</p>
        </div>
        <button onClick={exportCSV} disabled={subs.length === 0} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] disabled:opacity-60">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-accent" size={28} /></div>
        ) : subs.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No subscribers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Date Subscribed</th>
                <th className="p-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3 text-foreground">{s.email}</td>
                    <td className="p-3 text-muted-foreground">{s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : "—"}</td>
                    <td className="p-3">
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterManager;
