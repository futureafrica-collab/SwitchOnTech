import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, MessageCircle, Search, X, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { products as fallbackProducts, categories, formatPrice, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const badgeColor = (badge: string) => {
  if (badge === "In Stock") return "bg-green-500";
  if (badge === "Limited Stock") return "bg-orange-500";
  return "bg-blue-500";
};

const Shop = () => {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: p.category,
            specs: p.specs || "",
            price: Number(p.price),
            image: p.images && p.images.length > 0 ? p.images[0] : "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
            badge: p.stock_status || "In Stock",
            description: p.description || "",
          }))
        );
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products
    .filter((p) => active === "All" || p.category === active)
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.specs.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-accent py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative container mx-auto px-4 text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-4">
            Computer Shop
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Genuine laptops, desktops, accessories and more at the best prices in Nigeria
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#products"
              className="px-6 py-3 rounded-lg text-sm font-bold bg-white text-primary hover:bg-white/90 transition-colors"
            >
              Browse Products
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity"
            >
              Contact for Bulk Order
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Search Bar */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for laptops, printers, accessories..."
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                active === cat
                  ? "text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))]"
                  : "text-foreground bg-background border border-border hover:border-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <section id="products" className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active + search}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))]">
                          {product.category}
                        </span>
                        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${badgeColor(product.badge)}`}>
                          {product.badge}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="font-bold text-foreground leading-snug line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.specs}</p>
                        <p className="text-xl font-extrabold bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] bg-clip-text text-transparent">
                          {formatPrice(product.price)}
                        </p>
                        <div className="flex flex-col gap-2 pt-2">
                          <button
                            onClick={() => addItem(product)}
                            className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                          >
                            <ShoppingCart size={14} /> Add to Cart
                          </button>
                          <Link
                            to={`/shop/${product.id}`}
                            className="w-full py-2.5 rounded-lg text-sm font-semibold text-foreground border border-border text-center hover:bg-muted transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-16">
                  {search.trim()
                    ? "No products found for your search. Try a different keyword or browse our categories below."
                    : "No products in this category yet."}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Need Help Choosing?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Chat with our team on WhatsApp for personalized recommendations, bulk pricing, or any questions.
          </p>
          <a
            href="https://wa.me/2348050624942?text=Hi%2C%20I%20am%20interested%20in%20buying%20from%20your%20shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-[#25D366] hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
