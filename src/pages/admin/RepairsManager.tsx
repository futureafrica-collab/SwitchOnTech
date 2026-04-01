import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Loader2, X } from "lucide-react";

const statuses = ["pending", "in progress", "completed", "cancelled"];
const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    "in progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return map[s?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const urgencyBadge = (u: string) => {
  const map: Record<string, string> = {
    normal: "bg-blue-100 text-blue-800",
    urgent: "bg-orange-100 text-orange-800",
    emergency: "bg-red-100 text-red-800",
  };
  return map[u?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const RepairsManager = () => {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState<any | null>(null);
  const { toast } = useToast();

  const fetchRepairs = async () => {
    setLoading(true);
    const { data } = await supabase.from("repair_requests").select("*").order("created_at", { ascending: false });
    setRepairs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchRepairs(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const repair = repairs.find((r) => r.id === id);
    const { error } = await supabase.from("repair_requests").update({ status }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Status updated to ${status}` });

    // Send repair status update email
    if (repair) {
      await supabase.functions.invoke("send-email", {
        body: {
          template: "repair-status-update",
          to: repair.email,
          data: { full_name: repair.full_name, status },
        },
      });
    }

    fetchRepairs();
    if (detail?.id === id) setDetail({ ...detail, status });
  };

  const filtered = repairs
    .filter((r) => statusFilter === "all" || r.status?.toLowerCase() === statusFilter)
    .filter((r) => !search.trim() || r.full_name?.toLowerCase().includes(search.toLowerCase()) || r.phone?.includes(search));

  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone..." className={`${inputClass} pl-9`} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="all">All Status</option>
          {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-accent" size={28} /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No repair requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Phone</th>
                <th className="p-3 font-medium">Device</th>
                <th className="p-3 font-medium">Issue</th>
                <th className="p-3 font-medium">Urgency</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer" onClick={() => setDetail(r)}>
                    <td className="p-3 text-foreground font-medium">{r.full_name}</td>
                    <td className="p-3 text-muted-foreground">{r.phone}</td>
                    <td className="p-3 text-muted-foreground">{r.device_type}</td>
                    <td className="p-3 text-muted-foreground max-w-[150px] truncate">{r.issue_description}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyBadge(r.urgency)}`}>{r.urgency}</span></td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(r.status)}`}>{r.status}</span></td>
                    <td className="p-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="text-xs border border-border rounded-lg px-2 py-1 bg-background">
                        {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Repair Details</h2>
              <button onClick={() => setDetail(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-foreground">Name:</span> <span className="text-muted-foreground">{detail.full_name}</span></div>
              <div><span className="font-medium text-foreground">Email:</span> <span className="text-muted-foreground">{detail.email}</span></div>
              <div><span className="font-medium text-foreground">Phone:</span> <span className="text-muted-foreground">{detail.phone}</span></div>
              <div><span className="font-medium text-foreground">Device:</span> <span className="text-muted-foreground">{detail.device_type} — {detail.device_model || "N/A"}</span></div>
              <div><span className="font-medium text-foreground">Issue:</span> <p className="text-muted-foreground mt-1">{detail.issue_description}</p></div>
              <div><span className="font-medium text-foreground">Contact Method:</span> <span className="text-muted-foreground">{detail.preferred_contact}</span></div>
              <div><span className="font-medium text-foreground">Urgency:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyBadge(detail.urgency)}`}>{detail.urgency}</span></div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Status:</span>
                <select value={detail.status} onChange={(e) => updateStatus(detail.id, e.target.value)} className="text-xs border border-border rounded-lg px-2 py-1 bg-background">
                  {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div><span className="font-medium text-foreground">Submitted:</span> <span className="text-muted-foreground">{new Date(detail.created_at).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairsManager;
