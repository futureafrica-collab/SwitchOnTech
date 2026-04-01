import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

/* ── helpers ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
} as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(id);
      }
      setValue(start);
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);

  return <span ref={ref}>{value}{suffix}</span>;
}

/* ── data ── */
const services = [
  {
    title: "Networking Setup & Configuration",
    description:
      "Professional LAN, WAN and wireless network installation for homes, offices and businesses. We handle full network design, installation, configuration and maintenance.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    features: [
      "LAN & WAN Setup",
      "WiFi Installation & Configuration",
      "Network Security Setup",
      "Router & Switch Configuration",
      "Network Troubleshooting",
    ],
    cta: "Request This Service",
  },
  {
    title: "System Repair & Maintenance",
    description:
      "Fast, reliable diagnosis and repair for all devices. Our expert technicians fix laptops, desktops, printers and all peripherals with a fast turnaround guarantee.",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
    features: [
      "Laptop Screen Replacement",
      "Motherboard Repair",
      "Virus & Malware Removal",
      "Data Recovery",
      "Hardware Upgrades",
      "Printer Repair",
    ],
    cta: "Request This Service",
  },
  {
    title: "CCTV & Security Installation",
    description:
      "Complete security solutions for homes and businesses. We supply, install and configure CCTV cameras, biometric systems, security doors and access control systems.",
    image:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    features: [
      "CCTV Camera Installation",
      "Biometric Door Systems",
      "Security Door Installation",
      "Access Control Systems",
      "Customised Integration Protocol",
      "Remote Monitoring Configuration",
      "Security Consultation",
    ],
    cta: "Request This Service",
  },
  {
    title: "ICT Training Programs",
    description:
      "Hands-on practical training for students, professionals and businesses. Learn hardware repair, networking, software skills and more from certified instructors.",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    features: [
      "Hardware Repair Training",
      "Networking Fundamentals",
      "Software Installation & Management",
      "CCTV Installation Training",
      "Microsoft Office Suite",
      "Internet & Cybersecurity Basics",
    ],
    cta: "Enroll Now",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Clients Served" },
  { value: 1000, suffix: "+", label: "Devices Repaired" },
  { value: 5, suffix: "+", label: "Years Experience" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
];

/* ── page ── */
const Services = () => {
  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-accent py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative container mx-auto px-4 text-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-4">
            Our Services
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Professional ICT solutions tailored for individuals and businesses across Nigeria
          </p>
        </motion.div>
      </section>

      {/* ─── Service Sections ─── */}
      {services.map((service, i) => {
        const reversed = i % 2 !== 0;
        return <ServiceBlock key={service.title} service={service} reversed={reversed} />;
      })}

      {/* ─── Stats Banner ─── */}
      <section className="bg-primary py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp}>
              <p className="text-4xl sm:text-5xl font-extrabold text-primary-foreground">
                <CountUp target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm sm:text-base text-primary-foreground/70 font-medium">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-muted py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="container mx-auto px-4 text-center max-w-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Need a Service Not Listed?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Contact us directly and we will find the best solution for you
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center px-7 py-3.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all hover:scale-105"
            >
              Contact Us
            </Link>
            <Link
              to="/repair"
              className="inline-flex items-center px-7 py-3.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-all hover:scale-105"
            >
              Request Repair
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

/* ── Service Block ── */
function ServiceBlock({
  service,
  reversed,
}: {
  service: (typeof services)[number];
  reversed: boolean;
}) {
  return (
    <section className="py-[60px]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className={`container mx-auto px-4 grid md:grid-cols-2 gap-10 lg:gap-16 items-center ${
          reversed ? "md:direction-rtl" : ""
        }`}
        style={reversed ? { direction: "rtl" } : undefined}
      >
        {/* Image */}
        <motion.div
          variants={fadeUp}
          className="overflow-hidden rounded-2xl"
          style={{ direction: "ltr" }}
        >
          <img
            src={service.image}
            alt={service.title}
            loading="lazy"
            className="w-full h-72 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* Text */}
        <motion.div variants={fadeUp} style={{ direction: "ltr" }} className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{service.title}</h2>
          <p className="text-muted-foreground leading-relaxed">{service.description}</p>

          <ul className="space-y-3">
            {service.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-foreground">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            to="/repair"
            className="inline-flex items-center px-7 py-3.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))] hover:opacity-90 transition-all hover:scale-105"
          >
            {service.cta}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Services;
