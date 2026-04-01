import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, MessageCircle, Check, Minus, Plus, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { products as fallbackProducts, formatPrice, Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const badgeColor = (badge: string) => {
  if (badge === "In Stock") return "bg-green-500";
  if (badge === "Limited Stock") return "bg-orange-500";
  return "bg-blue-500";
};

const mapDbProduct = (p: any): Product => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  specs: p.specs || "",
  price: Number(p.price),
  image: p.images && p.images.length > 0 ? p.images[0] : "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
  badge: p.stock_status || "In Stock",
  description: p.description || "",
});

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      // Try DB first
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        const mapped = mapDbProduct(data);
        setProduct(mapped);

        // Fetch related from DB
        const { data: relData } = await supabase
          .from("products")
          .select("*")
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(4);

        setRelated(relData ? relData.map(mapDbProduct) : []);
      } else {
        // Fallback to static data
        const found = fallbackProducts.find((p) => p.slug === slug) || null;
        setProduct(found);
        if (found) {
          setRelated(fallbackProducts.filter((p) => p.category === found.category && p.slug !== found.slug).slice(0, 4));
        }
      }

      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-accent" size={32} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-accent font-semibold hover:underline">← Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const specsList = product.specs.split(" | ");
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in the ${product.name} (${formatPrice(product.price)}). Is it available?`);

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Navbar />

      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline mb-8">
            <ArrowLeft size={16} /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="rounded-2xl overflow-hidden border border-border">
              <img src={product.image} alt={product.name} className="w-full h-[400px] sm:h-[500px] object-cover" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))]">{product.category}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${badgeColor(product.badge)}`}>{product.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">{product.name}</h1>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] bg-clip-text text-transparent">{formatPrice(product.price)}</p>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Specifications</h3>
                <ul className="space-y-1.5">
                  {specsList.map((spec) => (
                    <li key={spec} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-accent flex-shrink-0" /> {spec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">Quantity</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-foreground"><Minus size={16} /></button>
                  <span className="w-10 text-center font-semibold text-foreground">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-foreground"><Plus size={16} /></button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={() => addItem(product, qty)} className="flex-1 py-3 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <a
                  href={`https://wa.me/2348050624942?text=${encodeURIComponent(`Hi, I want to buy *${product.name}* (Qty: ${qty}) at ${formatPrice(product.price * qty)}. Please confirm availability and payment details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-lg text-sm font-bold text-white bg-[#25D366] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} /> Buy via WhatsApp
                </a>
              </div>

              <a href={`https://wa.me/2348050624942?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-[#25D366] hover:opacity-90 transition-opacity">
                <MessageCircle size={16} /> Chat on WhatsApp about this product
              </a>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rp, i) => (
                <motion.div key={rp.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <Link to={`/shop/${rp.slug}`} className="group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
                    <div className="overflow-hidden h-40">
                      <img src={rp.image} alt={rp.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-accent transition-colors">{rp.name}</h3>
                      <p className="text-xs text-muted-foreground">{rp.specs}</p>
                      <p className="font-bold text-accent">{formatPrice(rp.price)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
