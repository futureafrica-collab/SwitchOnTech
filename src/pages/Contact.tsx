import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Phone, Mail, MapPin, MessageCircle, Facebook, Twitter, Instagram, Linkedin, Send, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
} as const;

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const serviceOptions = [
  "Networking",
  "System Repair",
  "CCTV & Security",
  "ICT Training",
  "Computer Sales",
  "Other",
];

const contactInfo = [
  {
    icon: Phone,
    label: "Call Us",
    value: "08050624942 / 08040085353",
    sub: "Mon - Sat, 8am - 6pm",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: "info@switchontech.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    label: "Branch 1",
    value: "19 Ashimawu Street Gbagada New Garage, Beside R-Jolad Hospital, Lagos",
    sub: "",
  },
  {
    icon: MapPin,
    label: "Branch 2",
    value: "Suite 32, Abraham Adesanya Shopping Mall, Onipanu, Lagos",
    sub: "",
  },
];

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

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
      if (start >= target) { setValue(target); clearInterval(id); } else setValue(start);
    }, 16);
    return () => clearInterval(id);
  }, [inView, target]);
  return <span ref={ref}>{value}{suffix}</span>;
}

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nlEmail, setNlEmail] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      service: form.service || null,
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We will get back to you soon." });
      setForm({ full_name: "", email: "", phone: "", service: "", message: "" });
      setErrors({});
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nlEmail)) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: nlEmail.trim() });
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already subscribed", description: "This email is already on our list." });
      } else {
        toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      }
    } else {
      // Send newsletter welcome email
      await supabase.functions.invoke("send-email", {
        body: { template: "newsletter-welcome", to: nlEmail.trim(), data: {} },
      });
      toast({ title: "Subscribed!", description: "Welcome to the community." });
    }
    setNlEmail("");
  };

  return (
    <>
      <ScrollProgressBar />
      <Navbar />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative py-20 md:py-28 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a237e 0%, #7b2ff7 100%)" }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            We are ready to help — reach out and we will respond fast
          </p>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12">
          {/* Left — Info */}
          <motion.div variants={fadeUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Get In Touch</h2>

            <div className="space-y-4">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--gradient-end)))" }}>
                    <c.icon className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</p>
                    <p className="font-semibold text-foreground">{c.value}</p>
                    <p className="text-sm text-muted-foreground">{c.sub}</p>
                  </div>
                </div>
              ))}

              {/* WhatsApp card */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-green-500">
                  <MessageCircle className="text-white" size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">WhatsApp</p>
                  <p className="font-semibold text-foreground">Chat with us instantly</p>
                  <a
                    href="https://wa.me/2348040085353"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-1.5 rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
                  >
                    Open WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3 pt-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-80"
                  style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--gradient-end)))" }}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div variants={fadeUp}>
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your full name"
                  />
                  {errors.full_name && <p className="text-destructive text-xs mt-1">{errors.full_name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="you@email.com"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="+234 ..."
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Service Interested In</label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    placeholder="Tell us how we can help..."
                  />
                  {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--gradient-end)))" }}
                >
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <Send size={16} />}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Map */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="py-16 bg-muted"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Find Our Location</h2>
          <div className="rounded-xl overflow-hidden shadow-sm border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.3598842!3d6.5480767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d7a6b000001%3A0x1234567890abcdef!2sGbagada%2C%20Lagos!5e0!3m2!1sen!2sng!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Switchon Tech Location"
            />
          </div>
        </div>
      </motion.section>

      {/* Newsletter */}
      <section className="py-16" style={{ background: "#1a237e" }}>
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Stay Updated with Tech Tips</h2>
          <p className="text-white/70 mb-8">
            Join our newsletter for the latest ICT news and exclusive offers
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={nlEmail}
              onChange={(e) => setNlEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg text-sm font-semibold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--gradient-end)))" }}
            >
              Subscribe
            </button>
          </form>
          <p className="text-white/50 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
