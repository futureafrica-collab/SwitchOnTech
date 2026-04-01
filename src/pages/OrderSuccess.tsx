import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const OrderSuccess = () => {
  const location = useLocation();
  const reference = (location.state as { reference?: string })?.reference || "SOT-XXXXXX";

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-8"
          >
            <CheckCircle size={48} className="text-green-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. We will process it and contact you shortly with delivery details.
            </p>
            <p className="text-sm text-muted-foreground">Check your email for confirmation details.</p>
            <div className="bg-secondary/50 border border-border rounded-xl p-4 inline-block">
              <p className="text-xs text-muted-foreground">Order Reference</p>
              <p className="text-lg font-bold text-foreground">{reference}</p>
            </div>
            <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/account"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity"
              >
                <User size={16} /> View My Orders
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-bold border border-border text-foreground hover:bg-muted transition-colors"
              >
                <ShoppingBag size={16} /> Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
