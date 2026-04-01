import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Package, Wrench, Mail, Loader2 } from "lucide-react";
import { formatPrice } from "@/data/products";

interface Stats {
  products: number;
  orders: number;
  pendingRepairs: number;
  subscribers: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, pendingRepairs: 0, subscribers: 0 });
  const [recentRepairs, setRecentRepairs] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [prodRes, ordRes, repRes, subRes, repLatest, ordLatest] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("repair_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
        supabase.from("repair_requests").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        products: prodRes.count || 0,
        orders: ordRes.count || 0,
        pendingRepairs: repRes.count || 0,
        subscribers: subRes.count || 0,
      });
      setRecentRepairs(repLatest.data || []);
      setRecentOrders(ordLatest.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: "Total Products", value: stats.products, icon: ShoppingBag, color: "from-blue-500 to-blue-600" },
    { label: "Total Orders", value: stats.orders, icon: Package, color: "from-green-500 to-green-600" },
    { label: "Pending Repairs", value: stats.pendingRepairs, icon: Wrench, color: "from-orange-500 to-orange-600" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, color: "from-purple-500 to-purple-600" },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      "in progress": "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center`}>
              <c.icon className="text-white" size={22} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Repairs */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-bold text-foreground mb-4">Recent Repair Requests</h2>
          {recentRepairs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No repair requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Device</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr></thead>
                <tbody>
                  {recentRepairs.map((r) => (
                    <tr key={r.id} className="border-b border-border/50">
                      <td className="py-2.5 text-foreground">{r.full_name}</td>
                      <td className="py-2.5 text-muted-foreground">{r.device_type}</td>
                      <td className="py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(r.status)}`}>{r.status}</span></td>
                      <td className="py-2.5 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-bold text-foreground mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr></thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-border/50">
                      <td className="py-2.5 text-foreground">{o.customer_name}</td>
                      <td className="py-2.5 text-foreground font-medium">{formatPrice(Number(o.total_amount))}</td>
                      <td className="py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(o.status)}`}>{o.status}</span></td>
                      <td className="py-2.5 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
