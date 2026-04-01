import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const posts = [
  {
    slug: "5-signs-your-laptop-needs-professional-repair",
    title: "5 Signs Your Laptop Needs Professional Repair",
    category: "Repair Tips",
    date: "Mar 20, 2026",
    excerpt: "Don't ignore these warning signs — catching issues early can save you money and extend your laptop's lifespan.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "how-to-choose-the-right-cctv-system-for-your-business",
    title: "How to Choose the Right CCTV System for Your Business",
    category: "Security",
    date: "Mar 15, 2026",
    excerpt: "A complete guide to selecting the best surveillance setup based on your business size and security needs.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
  },
  {
    slug: "best-budget-laptops-for-students-in-2026",
    title: "Top 10 Laptops for Students in Nigeria (2026)",
    category: "Buying Guide",
    date: "Mar 10, 2026",
    excerpt: "We break down the best budget-friendly and performance laptops available for Nigerian students this year.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
  },
];

const BlogPreview = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Blog</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">Latest from our Blog</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group bg-secondary rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="px-2.5 py-1 bg-gradient-to-r from-accent to-[hsl(326,95%,50%)] text-white rounded-full font-semibold">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} /> {post.date}
                  </span>
                </div>
                <h3 className="font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1">
                  Read More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
