import { Zap, Users, BadgeDollarSign, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const values = [
  { icon: Zap, title: "Fast Turnaround", description: "Quick diagnostics and speedy repairs so you're never offline for long.", stat: "24hrs" },
  { icon: Users, title: "Expert Technicians", description: "Certified professionals with years of hands-on ICT experience.", stat: "10+ years" },
  { icon: BadgeDollarSign, title: "Affordable Pricing", description: "Competitive rates without compromising on quality or service.", stat: "Best Rates" },
  { icon: ShieldCheck, title: "Trusted by Hundreds", description: "Businesses and individuals across Nigeria rely on us every day.", stat: "500+ clients" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Why Us</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">Why Choose SwitchOn Tech</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-[hsl(326,95%,50%)] flex items-center justify-center mx-auto shadow-lg">
                <v.icon className="text-white" size={28} />
              </div>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 + 0.3, type: "spring" }}
                className="text-2xl font-extrabold bg-gradient-to-r from-accent to-[hsl(326,95%,50%)] bg-clip-text text-transparent"
              >
                {v.stat}
              </motion.p>
              <h3 className="text-lg font-bold text-foreground">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
