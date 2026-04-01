import { Wifi, Wrench, ShieldCheck, GraduationCap, Monitor, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const services = [
  { icon: Wifi, title: "Networking Setup", description: "Professional LAN, WAN and wireless network installation for homes and businesses." },
  { icon: Wrench, title: "System Repair", description: "Fast diagnosis and repair for laptops, desktops, printers, and peripherals." },
  { icon: ShieldCheck, title: "CCTV & Security", description: "Complete surveillance and security camera installation and maintenance." },
  { icon: GraduationCap, title: "ICT Training", description: "Hands-on training in hardware repair, networking, and software skills." },
  { icon: Monitor, title: "Computer Sales", description: "Genuine laptops, desktops, and accessories at competitive prices." },
  { icon: BriefcaseBusiness, title: "IT Consulting", description: "Strategic IT planning and infrastructure consulting for growing businesses." },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const ServicesSection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Our Expertise</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">What We Do</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            From repairs to installations, we provide end-to-end ICT services you can rely on.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -12px hsl(233 65% 30% / 0.15)" }}
              className="group relative bg-background rounded-xl p-7 border border-border transition-all duration-300 overflow-hidden"
            >
              {/* Hover left border accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-[hsl(326,95%,50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-[hsl(326,95%,50%)] flex items-center justify-center mb-5"
                whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
              >
                <service.icon className="text-white" size={22} />
              </motion.div>
              <h3 className="text-lg font-bold text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
              <Link
                to="/services"
                className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1"
              >
                Learn More →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
