import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Target, Eye, Shield, Zap, Heart, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

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
      if (start >= target) { setValue(target); clearInterval(id); }
      else setValue(start);
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);
  return <span ref={ref}>{value}{suffix}</span>;
}

const values = [
  { icon: Shield, title: "Integrity", desc: "We are honest in every service we deliver" },
  { icon: Award, title: "Excellence", desc: "We never compromise on quality" },
  { icon: Zap, title: "Speed", desc: "Fast turnaround without cutting corners" },
  { icon: Heart, title: "Customer First", desc: "Your satisfaction is our priority" },
];

const team = [
  { name: "Adeolu Oyewo", role: "Founder & CEO, Switchon Tech", bio: "Passionate about technology and committed to making professional ICT services accessible to every Nigerian.", image: "https://jrijjoszmlupeljifedk.supabase.co/storage/v1/object/public/nrsa-uploads/uploads/1767086687599-GB.png" },
];

const stats = [
  { target: 500, suffix: "+", label: "Clients Served" },
  { target: 1000, suffix: "+", label: "Devices Repaired" },
  { target: 5, suffix: "+", label: "Years Experience" },
  { target: 98, suffix: "%", label: "Satisfaction Rate" },
];

const About = () => (
  <>
    <ScrollProgressBar />
    <Navbar />

    {/* ── Hero ── */}
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="relative py-20 md:py-28 text-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a237e 0%, #7b2ff7 100%)" }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">About Switchon Tech</h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
          Nigeria's trusted complete ICT center — built to serve you better
        </p>
      </div>
    </motion.section>

    {/* ── Our Story ── */}
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={fadeUp} className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Who We Are</h2>
          <p className="text-muted-foreground leading-relaxed">
            Switchon Tech was founded with one clear mission — to make professional ICT services accessible and affordable to every Nigerian individual and business.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            From computer repairs and networking to security installations and ICT training, we have built a reputation for quality, speed and reliability.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We are not just a tech company. We are your technology partner — here to ensure your devices work, your networks are secure, and your team has the skills to thrive in a digital world.
          </p>
        </motion.div>
        <motion.div variants={fadeUp}>
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
            alt="Switchon Tech workspace"
            className="rounded-xl shadow-lg w-full object-cover aspect-[4/3]"
            loading="lazy"
          />
        </motion.div>
      </div>
    </motion.section>

    {/* ── Mission & Vision ── */}
    <section className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              Icon: Target,
              title: "Our Mission",
              text: "To provide reliable, affordable and professional ICT services that empower individuals and businesses across Nigeria to succeed in a digital world.",
            },
            {
              Icon: Eye,
              title: "Our Vision",
              text: "To be Nigeria's most trusted complete ICT center — known for excellence, innovation and genuine customer care.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-xl p-8 shadow-sm border-t-4"
              style={{ borderImage: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--gradient-end))) 1" }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--gradient-end)))" }}>
                <card.Icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Core Values ── */}
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">What Drives Us</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <motion.div key={v.title} variants={fadeUp} className="bg-card rounded-xl p-6 shadow-sm border border-border text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--gradient-end)))" }}>
                <v.icon className="text-white" size={22} />
              </div>
              <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* ── Team ── */}
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-16 md:py-24 bg-muted"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12">Meet Our Team</h2>
        <div className="flex justify-center">
          {team.map((m) => (
            <motion.div key={m.name} variants={fadeUp}
              className="bg-card rounded-xl p-8 text-center shadow-sm border border-border hover:-translate-y-1 transition-transform max-w-sm w-full">
              <img src={m.image} alt={m.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
              <h3 className="font-bold text-foreground text-lg">{m.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{m.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* ── Stats ── */}
    <section className="py-16" style={{ background: "#1a237e" }}>
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-3xl md:text-4xl font-bold text-white"><CountUp target={s.target} suffix={s.suffix} /></p>
            <p className="text-white/70 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Work With Us?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Get in touch today and let us solve your ICT challenges
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center px-8 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--gradient-end)))" }}
        >
          Contact Us
        </Link>
      </div>
    </section>

    <Footer />
  </>
);

export default About;
