import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const nigerianStates = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.state) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Cart is empty", description: "Add items to your cart before checking out.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const ref = "SOT-" + Date.now().toString(36).toUpperCase();

    // Save order to database
    const { error } = await supabase.from("orders").insert({
      customer_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      delivery_address: form.address.trim(),
      city: form.city.trim(),
      state: form.state,
      items: items.map((i) => ({ id: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
      total_amount: totalPrice,
      paystack_reference: ref,
      status: "pending",
      user_id: user?.id,
    } as any);

    setLoading(false);

    if (error) {
      toast({ title: "Order failed", description: "Something went wrong. Please try again.", variant: "destructive" });
      return;
    }

    // Send order confirmation email (best-effort)
    supabase.functions.invoke("send-email", {
      body: {
        template: "order-confirmation",
        to: form.email.trim(),
        data: {
          customer_name: form.full_name.trim(),
          reference: ref,
          items: items.map((i) => ({ name: i.product.name, price: i.product.price, quantity: i.quantity })),
          total_amount: totalPrice,
          delivery_address: form.address.trim(),
          city: form.city.trim(),
          state: form.state,
        },
      },
    });

    // Build WhatsApp message with order details
    const itemLines = items
      .map((i) => `• ${i.product.name} x${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`)
      .join("\n");
    const whatsappMessage = encodeURIComponent(
      `🛒 *New Order from SwitchOn Tech*\n\n` +
      `*Ref:* ${ref}\n` +
      `*Customer:* ${form.full_name.trim()}\n` +
      `*Phone:* ${form.phone.trim()}\n` +
      `*Email:* ${form.email.trim()}\n\n` +
      `*Items:*\n${items.map((i) => `• ${i.product.name} x${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`).join("\n")}\n\n` +
      `*Total:* ${formatPrice(totalPrice)}\n\n` +
      `*Delivery:* ${form.address.trim()}, ${form.city.trim()}, ${form.state}\n\n` +
      `I'd like to proceed with this order. Please confirm availability and payment details.`
    );

    // Open WhatsApp
    window.open(`https://wa.me/2348050624942?text=${whatsappMessage}`, "_blank");

    clearCart();
    navigate("/order-success", { state: { reference: ref } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <Link to="/shop" className="text-accent font-semibold hover:underline">← Continue Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-32 flex items-center justify-center">
          <span className="h-8 w-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <ScrollProgressBar />
        <Navbar />
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 max-w-md text-center">
            <div className="bg-card border border-border rounded-2xl p-8 space-y-5">
              <h1 className="text-2xl font-extrabold text-foreground">Sign in to Checkout</h1>
              <p className="text-muted-foreground text-sm">
                Please log in or create an account to complete your purchase. Your cart items will be saved.
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  to="/login"
                  state={{ from: "/checkout" }}
                  className="w-full py-3 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <LogIn size={16} /> Log In
                </Link>
                <Link
                  to="/register"
                  state={{ from: "/checkout" }}
                  className="w-full py-3 rounded-lg text-sm font-semibold text-foreground border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} /> Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Navbar />

      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline mb-8">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>

          <h1 className="text-3xl font-extrabold text-foreground mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              <h2 className="text-xl font-bold text-foreground">Customer Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                  <input type="text" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className={inputClass} placeholder="Your full name" maxLength={100} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="you@email.com" maxLength={255} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="08012345678" maxLength={20} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Delivery Address *</label>
                <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className={inputClass} placeholder="Street address" maxLength={300} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">City *</label>
                  <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} placeholder="City" maxLength={100} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">State *</label>
                  <select value={form.state} onChange={(e) => update("state", e.target.value)} className={inputClass} required>
                    <option value="" disabled>Select state</option>
                    {nigerianStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Order…
                    </span>
                  ) : (
                    `Order via WhatsApp — ${formatPrice(totalPrice)}`
                  )}
                </button>
              </div>
            </form>

            {/* Order Summary */}
            <div className="bg-card border border-border rounded-2xl p-6 h-fit sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-5">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground whitespace-nowrap">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex items-center justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] bg-clip-text text-transparent">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
