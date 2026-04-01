import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { supabase } from "@/integrations/supabase/client";

const categories = ["All", "Repair Tips", "Networking", "Security", "Training", "Buying Guide", "General"];

interface BlogPost {
  slug: string;
  category: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
}

const fallbackPosts: BlogPost[] = [
  { slug: "5-signs-your-laptop-needs-professional-repair", category: "Repair Tips", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80", title: "5 Signs Your Laptop Needs Professional Repair", excerpt: "Ignoring these warning signs could cost you more in the long run. Here is what to watch out for.", author: "Switchon Tech", date: "March 20, 2026", readTime: "5 min read" },
  { slug: "how-to-choose-the-right-cctv-system-for-your-business", category: "Security", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80", title: "How to Choose the Right CCTV System for Your Business", excerpt: "Not all CCTV systems are equal. We break down what to look for before making a purchase.", author: "Switchon Tech", date: "March 15, 2026", readTime: "7 min read" },
  { slug: "setting-up-a-reliable-office-network-in-nigeria", category: "Networking", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", title: "Setting Up a Reliable Office Network in Nigeria", excerpt: "A step-by-step guide to building a fast, secure and scalable office network from scratch.", author: "Switchon Tech", date: "March 10, 2026", readTime: "6 min read" },
  { slug: "best-budget-laptops-for-students-in-2026", category: "Buying Guide", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", title: "Best Budget Laptops for Students in 2026", excerpt: "Our top picks for affordable laptops that deliver great performance for school and everyday tasks.", author: "Switchon Tech", date: "March 5, 2026", readTime: "8 min read" },
  { slug: "why-every-nigerian-youth-should-learn-ict-skills", category: "Training", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80", title: "Why Every Nigerian Youth Should Learn ICT Skills", excerpt: "The digital economy is booming. Here is why ICT training is the smartest investment you can make.", author: "Switchon Tech", date: "February 28, 2026", readTime: "4 min read" },
  { slug: "switchon-tech-expands-services-to-more-cities", category: "General", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", title: "Switchon Tech Expands Services to More Cities", excerpt: "We are bringing professional ICT solutions to more communities across Nigeria. See what is new.", author: "Switchon Tech", date: "February 20, 2026", readTime: "3 min read" },
];

const Blog = () => {
  const [active, setActive] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setPosts(
          data.map((p) => ({
            slug: p.slug,
            category: p.category || "General",
            image: p.featured_image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            title: p.title,
            excerpt: p.excerpt || "",
            author: p.author || "Switchon Tech",
            date: new Date(p.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            readTime: p.read_time || "5 min read",
          }))
        );
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);

  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-accent py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-4">Our Blog</h1>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto">Tech tips, repair guides, security advice and ICT news for Nigeria</p>
        </motion.div>
      </section>

      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActive(cat)} className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${active === cat ? "text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))]" : "text-foreground bg-background border border-border hover:border-accent"}`}>{cat}</button>
          ))}
        </div>
      </div>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-accent" size={32} />
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map((post, i) => (
                    <motion.article key={post.slug} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="overflow-hidden">
                        <img src={post.image} alt={post.title} loading="lazy" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 space-y-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))]">{post.category}</span>
                        <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        <div className="text-xs text-muted-foreground pt-1">{post.author} &middot; {post.date} &middot; {post.readTime}</div>
                        <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] bg-clip-text text-transparent group-hover:gap-2.5 transition-all">
                          Read More <ArrowRight size={14} className="text-accent" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              </AnimatePresence>
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-16">No posts in this category yet.</p>}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
