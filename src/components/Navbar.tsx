import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut, User, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.jpeg";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Shop", href: "/shop" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setDrawerOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    const name = user?.user_metadata?.full_name as string | undefined;
    if (name) return name.charAt(0).toUpperCase();
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-background shadow-md border-border"
          : "bg-background/60 backdrop-blur border-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SwitchOn Tech" className="h-10 w-10 rounded-md object-cover" />
          <span className="font-bold text-lg text-primary hidden sm:inline">SwitchOn Tech</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Cart Icon */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))]">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-[hsl(var(--gradient-end))] flex items-center justify-center text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-accent/50">
                  {getInitials()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link to="/account" className="flex items-center gap-2 cursor-pointer">
                    <User size={14} /> My Account
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/dashboard" className="flex items-center gap-2 cursor-pointer text-accent font-semibold">
                      <Lock size={14} /> Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut size={14} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hidden sm:inline"
            >
              Login
            </Link>
          )}

          {/* Request Repair - Desktop */}
          <div className="hidden lg:block">
            <Link
              to="/repair"
              className="relative inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-[hsl(326,95%,50%)] hover:opacity-90 transition-opacity animate-[pulse_3s_ease-in-out_infinite]"
              style={{
                boxShadow: "0 0 20px hsl(268 93% 58% / 0.4), 0 0 40px hsl(326 95% 50% / 0.2)",
              }}
            >
              Request Repair
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background px-4 pb-4"
          >
            <ul className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 px-3 rounded-md text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Mobile auth links */}
              {user ? (
                <>
                  <li>
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-md text-sm font-medium text-foreground/80 hover:bg-muted hover:text-primary transition-colors">
                      My Account
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-md text-sm font-bold text-accent hover:bg-muted transition-colors">
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 rounded-md text-sm font-medium text-accent hover:bg-muted transition-colors">
                    Login / Register
                  </Link>
                </li>
              )}
            </ul>
            <Link
              to="/repair"
              onClick={() => setMobileOpen(false)}
              className="mt-3 block text-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-[hsl(326,95%,50%)]"
            >
              Request Repair
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
