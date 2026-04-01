import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, ShoppingBag, FileText, Wrench, Package,
  Mail, Settings, LogOut, Menu, X, Bell, ChevronRight, Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", path: "/admin/dashboard/products", icon: ShoppingBag },
  { label: "Blog Posts", path: "/admin/dashboard/blog", icon: FileText },
  { label: "Repair Requests", path: "/admin/dashboard/repairs", icon: Wrench },
  { label: "Orders", path: "/admin/dashboard/orders", icon: Package },
  { label: "Customers", path: "/admin/dashboard/customers", icon: Users },
  { label: "Newsletter", path: "/admin/dashboard/newsletter", icon: Mail },
  { label: "Settings", path: "/admin/dashboard/settings", icon: Settings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTitle = navItems.find((n) => location.pathname === n.path)?.label || "Dashboard";

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <img src="/favicon.jpeg" alt="Switchon Tech" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-extrabold text-foreground text-sm">Switchon Tech</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-bold text-foreground">{currentTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell size={20} />
            </button>
            <div className="text-sm font-medium text-foreground hidden sm:block">Adeolu Oyewo</div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-[hsl(var(--gradient-end))] flex items-center justify-center text-white text-xs font-bold">
              AO
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
