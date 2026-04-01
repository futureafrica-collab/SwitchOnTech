import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/data/products";
import { Loader2, X, Package, Wrench, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const orderTimelineSteps = ["Order Placed", "Confirmed", "Processing", "Shipped", "Delivered"];
const orderStatusToStep: Record<string, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4, cancelled: -1,
};

const repairTimelineSteps = ["Submitted", "In Progress", "Completed"];
const repairStatusToStep: Record<string, number> = {
  pending: 0, "in progress": 1, completed: 2, cancelled: -1,
};

const badgeColor = (s: string) => {
  const map: Record<string, string> = {
    pending: "bg-gray-100 text-gray-800", confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-orange-100 text-orange-800", shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800",
    "in progress": "bg-blue-100 text-blue-800", completed: "bg-green-100 text-green-800",
  };
  return map[s?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const urgencyColor = (u: string) => {
  const map: Record<string, string> = {
    normal: "bg-blue-100 text-blue-800", urgent: "bg-orange-100 text-orange-800", emergency: "bg-red-100 text-red-800",
  };
  return map[u?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const StatusTimeline = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => (
  <div className="flex items-center justify-center gap-0 my-5 flex-wrap">
    {steps.map((step, i) => (
      <div key={step} className="flex items-center">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
            i <= currentStep ? "bg-accent text-white border-accent" : "bg-muted border-border text-muted-foreground"
          }`}>{i + 1}</div>
          <span className="text-[10px] mt-1 text-center max-w-[65px] leading-tight text-muted-foreground">{step}</span>
        </div>
        {i < steps.length - 1 && (
          <div className={`w-8 h-0.5 mx-0.5 mt-[-16px] ${i < currentStep ? "bg-accent" : "bg-border"}`} />
        )}
      </div>
    ))}
  </div>
);

const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"orders" | "repairs" | "profile">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [repairDetail, setRepairDetail] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({ full_name: "", phone: "" });
  const [passwords, setPasswords] = useState({ new_password: "", confirm_password: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);

      // Fetch orders by user_id OR by email (for legacy orders without user_id)
      const [ordersByUserId, ordersByEmail, repairsRes, profileRes] = await Promise.all([
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("orders").select("*").eq("email", user.email!).order("created_at", { ascending: false }),
        supabase.from("repair_requests").select("*").eq("email", user.email!).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      ]);

      // Merge and deduplicate orders
      const allOrders = [...(ordersByUserId.data || []), ...(ordersByEmail.data || [])];
      const uniqueOrders = Array.from(new Map(allOrders.map((o: any) => [o.id, o])).values())
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setOrders(uniqueOrders);
      setRepairs(repairsRes.data || []);
      if (profileRes.data) {
        setProfile(profileRes.data);
        setProfileForm({ full_name: (profileRes.data as any).full_name || "", phone: (profileRes.data as any).phone || "" });
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const getItemsList = (items: any) => {
    try { return Array.isArray(items) ? items : typeof items === "string" ? JSON.parse(items) : []; }
    catch { return []; }
  };

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profileForm.full_name.trim(),
      phone: profileForm.phone.trim(),
    } as any).eq("id", user!.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated successfully" });
    }

    if (passwords.new_password) {
      if (passwords.new_password.length < 8) {
        toast({ title: "Password too short", description: "Minimum 8 characters", variant: "destructive" });
        setSaving(false);
        return;
      }
      if (passwords.new_password !== passwords.confirm_password) {
        toast({ title: "Passwords don't match", variant: "destructive" });
        setSaving(false);
        return;
      }
      const { error: pwError } = await supabase.auth.updateUser({ password: passwords.new_password });
      if (pwError) {
        toast({ title: "Password update failed", description: pwError.message, variant: "destructive" });
      } else {
        toast({ title: "Password updated" });
        setPasswords({ new_password: "", confirm_password: "" });
      }
    }
    setSaving(false);
  };

  const inputClass = "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50";
  const tabClass = (t: string) => `flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${tab === t ? "bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] text-white" : "text-muted-foreground hover:bg-muted"}`;

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Navbar />

      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-foreground">
              Welcome, {profile?.full_name || user?.user_metadata?.full_name || "Customer"}
            </h1>
            <p className="text-muted-foreground mt-1">Manage your orders, repairs, and account settings</p>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            <button onClick={() => setTab("orders")} className={tabClass("orders")}><Package size={16} />My Orders</button>
            <button onClick={() => setTab("repairs")} className={tabClass("repairs")}><Wrench size={16} />My Repairs</button>
            <button onClick={() => setTab("profile")} className={tabClass("profile")}><User size={16} />Profile Settings</button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
          ) : (
            <>
              {/* ── Orders ── */}
              {tab === "orders" && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  {orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-16">No orders yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                          <th className="p-3 font-medium">Order ID</th>
                          <th className="p-3 font-medium">Items</th>
                          <th className="p-3 font-medium">Total</th>
                          <th className="p-3 font-medium">Status</th>
                          <th className="p-3 font-medium">Date</th>
                          <th className="p-3 font-medium"></th>
                        </tr></thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o.id} className="border-b border-border/50 hover:bg-muted/20">
                              <td className="p-3 font-mono text-xs text-foreground">{o.id.slice(0, 8)}</td>
                              <td className="p-3 text-muted-foreground">{getItemsList(o.items).length} item(s)</td>
                              <td className="p-3 font-medium text-foreground">{formatPrice(Number(o.total_amount))}</td>
                              <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor(o.status)}`}>{o.status}</span></td>
                              <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                              <td className="p-3"><button onClick={() => setOrderDetail(o)} className="text-accent text-xs font-semibold hover:underline">View Details</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── Repairs ── */}
              {tab === "repairs" && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  {repairs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-16">No repair requests yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                          <th className="p-3 font-medium">Device</th>
                          <th className="p-3 font-medium">Issue</th>
                          <th className="p-3 font-medium">Urgency</th>
                          <th className="p-3 font-medium">Status</th>
                          <th className="p-3 font-medium">Date</th>
                          <th className="p-3 font-medium"></th>
                        </tr></thead>
                        <tbody>
                          {repairs.map(r => (
                            <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20">
                              <td className="p-3 text-foreground">{r.device_type}</td>
                              <td className="p-3 text-muted-foreground max-w-[200px] truncate">{r.issue_description}</td>
                              <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyColor(r.urgency)}`}>{r.urgency}</span></td>
                              <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor(r.status)}`}>{r.status}</span></td>
                              <td className="p-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                              <td className="p-3"><button onClick={() => setRepairDetail(r)} className="text-accent text-xs font-semibold hover:underline">View Details</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── Profile ── */}
              {tab === "profile" && (
                <div className="bg-card border border-border rounded-2xl p-6 max-w-lg">
                  <h2 className="text-lg font-bold text-foreground mb-5">Profile Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                      <input value={profileForm.full_name} onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                      <input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                      <input value={user?.email || ""} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
                    </div>
                    <hr className="border-border" />
                    <h3 className="text-sm font-bold text-foreground">Change Password</h3>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                      <input type="password" value={passwords.new_password} onChange={e => setPasswords(p => ({ ...p, new_password: e.target.value }))} className={inputClass} placeholder="Leave blank to keep current" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
                      <input type="password" value={passwords.confirm_password} onChange={e => setPasswords(p => ({ ...p, confirm_password: e.target.value }))} className={inputClass} />
                    </div>
                    <button onClick={saveProfile} disabled={saving} className="w-full py-3 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity disabled:opacity-60">
                      {saving ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Order Detail Modal ── */}
      {orderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md my-8 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Order Details</h2>
              <button onClick={() => setOrderDetail(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            {orderDetail.status?.toLowerCase() !== "cancelled" ? (
              <StatusTimeline steps={orderTimelineSteps} currentStep={orderStatusToStep[orderDetail.status?.toLowerCase()] ?? 0} />
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700 font-medium">Order Cancelled</div>
            )}

            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-foreground">Order ID:</span> <span className="text-muted-foreground font-mono text-xs">{orderDetail.id}</span></div>
              <div><span className="font-medium text-foreground">Address:</span> <span className="text-muted-foreground">{orderDetail.delivery_address || "N/A"}, {orderDetail.city}, {orderDetail.state}</span></div>
              <div><span className="font-medium text-foreground">Paystack Ref:</span> <span className="text-muted-foreground font-mono">{orderDetail.paystack_reference || "N/A"}</span></div>
              <div>
                <span className="font-medium text-foreground">Items:</span>
                <ul className="mt-1 space-y-1">
                  {getItemsList(orderDetail.items).map((item: any, i: number) => (
                    <li key={i} className="text-muted-foreground">• {item.name || "Item"} × {item.quantity || 1} — {formatPrice(Number(item.price || 0))}</li>
                  ))}
                </ul>
              </div>
              <div><span className="font-medium text-foreground">Total:</span> <span className="font-bold text-foreground">{formatPrice(Number(orderDetail.total_amount))}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ── Repair Detail Modal ── */}
      {repairDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Repair Details</h2>
              <button onClick={() => setRepairDetail(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            {repairDetail.status?.toLowerCase() !== "cancelled" ? (
              <StatusTimeline steps={repairTimelineSteps} currentStep={repairStatusToStep[repairDetail.status?.toLowerCase()] ?? 0} />
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700 font-medium">Request Cancelled</div>
            )}

            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-foreground">Device:</span> <span className="text-muted-foreground">{repairDetail.device_type} — {repairDetail.device_model || "N/A"}</span></div>
              <div><span className="font-medium text-foreground">Issue:</span> <p className="text-muted-foreground mt-1">{repairDetail.issue_description}</p></div>
              <div><span className="font-medium text-foreground">Urgency:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyColor(repairDetail.urgency)}`}>{repairDetail.urgency}</span></div>
              <div><span className="font-medium text-foreground">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor(repairDetail.status)}`}>{repairDetail.status}</span></div>
              <div><span className="font-medium text-foreground">Submitted:</span> <span className="text-muted-foreground">{new Date(repairDetail.created_at).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Account;
