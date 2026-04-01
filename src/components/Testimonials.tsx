import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    name: "Adebayo Johnson",
    role: "Small Business Owner",
    quote: "SwitchOn Tech set up our entire office network and CCTV system in just 2 days. Incredible service and very professional team!",
  },
  {
    name: "Chioma Okafor",
    role: "School Administrator",
    quote: "We've been buying laptops from SwitchOn Tech for our school. Great prices, genuine products, and they even helped with setup.",
  },
  {
    name: "Ibrahim Musa",
    role: "Freelance Designer",
    quote: "My laptop was dead and they fixed it in under 24 hours. The technicians really know what they're doing. Highly recommend!",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20" style={{ background: "linear-gradient(135deg, hsl(233 65% 30% / 0.05), hsl(268 93% 58% / 0.05))" }}>
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">What Our Clients Say</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:overflow-visible overflow-x-auto snap-x snap-mandatory">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative bg-background rounded-xl p-7 border border-border hover:shadow-md transition-shadow snap-center min-w-[280px]"
            >
              {/* Gradient left border */}
              <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-accent to-[hsl(326,95%,50%)]" />
              <Quote className="text-accent/40 mb-4" size={28} />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.quote}"</p>
              <div>
                <p className="font-bold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
