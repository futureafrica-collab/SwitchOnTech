import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/data/products";
import { Loader2, X } from "lucide-react";

const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-orange-100 text-orange-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return map[s?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const OrdersManager = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [detail, setDetail] = useState<any | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const order = orders.find((o) => o.id === id);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Order status updated to ${status}` });

    // Send status update email
    if (order) {
      await supabase.functions.invoke("send-email", {
        body: {
          template: "order-status-update",
          to: order.email,
          data: { customer_name: order.customer_name, reference: order.id.slice(0, 8), status },
        },
      });
    }

    fetchOrders();
    if (detail?.id === id) setDetail({ ...detail, status });
  };

  const filtered = orders.filter((o) => statusFilter === "all" || o.status?.toLowerCase() === statusFilter);
  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50";

  const getItemsCount = (items: any) => {
    try {
      const arr = typeof items === "string" ? JSON.parse(items) : items;
      return Array.isArray(arr) ? arr.length : 0;
    } catch { return 0; }
  };

  const getItemsList = (items: any) => {
    try {
      const arr = typeof items === "string" ? JSON.parse(items) : items;
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="all">All Status</option>
          {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-accent" size={28} /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground border-b border-border bg-muted/30">
                <th className="p-3 font-medium">Order ID</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Items</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer" onClick={() => setDetail(o)}>
                    <td className="p-3 text-foreground font-mono text-xs">{o.id.slice(0, 8)}</td>
                    <td className="p-3 text-foreground">{o.customer_name}</td>
                    <td className="p-3 text-muted-foreground">{getItemsCount(o.items)} item(s)</td>
                    <td className="p-3 text-foreground font-medium">{formatPrice(Number(o.total_amount))}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(o.status)}`}>{o.status}</span></td>
                    <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="text-xs border border-border rounded-lg px-2 py-1 bg-background">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md my-8 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Order Details</h2>
              <button onClick={() => setDetail(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-foreground">Order ID:</span> <span className="text-muted-foreground font-mono">{detail.id}</span></div>
              <div><span className="font-medium text-foreground">Customer:</span> <span className="text-muted-foreground">{detail.customer_name}</span></div>
              <div><span className="font-medium text-foreground">Email:</span> <span className="text-muted-foreground">{detail.email}</span></div>
              <div><span className="font-medium text-foreground">Phone:</span> <span className="text-muted-foreground">{detail.phone}</span></div>
              <div><span className="font-medium text-foreground">Address:</span> <span className="text-muted-foreground">{detail.delivery_address || "N/A"}, {detail.city}, {detail.state}</span></div>
              <div><span className="font-medium text-foreground">Paystack Ref:</span> <span className="text-muted-foreground font-mono">{detail.paystack_reference || "N/A"}</span></div>
              <div>
                <span className="font-medium text-foreground">Items:</span>
                <ul className="mt-1 space-y-1">
                  {getItemsList(detail.items).map((item: any, i: number) => (
                    <li key={i} className="text-muted-foreground">• {item.name || "Item"} × {item.quantity || 1} — {formatPrice(Number(item.price || 0))}</li>
                  ))}
                </ul>
              </div>
              <div><span className="font-medium text-foreground">Total:</span> <span className="text-foreground font-bold">{formatPrice(Number(detail.total_amount))}</span></div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Status:</span>
                <select value={detail.status} onChange={(e) => updateStatus(detail.id, e.target.value)} className="text-xs border border-border rounded-lg px-2 py-1 bg-background">
                  {statuses.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
