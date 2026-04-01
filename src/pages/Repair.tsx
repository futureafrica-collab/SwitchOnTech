import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ClipboardList, Search, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const deviceTypes = [
  "Laptop",
  "Desktop Computer",
  "Printer",
  "Phone",
  "Networking Equipment",
  "CCTV/Security System",
  "Other",
];

const urgencyOptions = [
  { value: "normal", label: "Normal (2–3 business days)" },
  { value: "urgent", label: "Urgent (same day)" },
  { value: "emergency", label: "Emergency (within hours)" },
];

const contactMethods = [
  { value: "phone", label: "Phone Call" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
];

const steps = [
  {
    num: 1,
    title: "Submit Request",
    desc: "Fill the form above with your device details and issue description.",
    icon: ClipboardList,
  },
  {
    num: 2,
    title: "We Diagnose",
    desc: "Our technician reviews your request and contacts you within 2 hours.",
    icon: Search,
  },
  {
    num: 3,
    title: "Problem Solved",
    desc: "Fast, professional repair with quality guarantee.",
    icon: CheckCircle,
  },
];

const Repair = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    device_type: "",
    device_model: "",
    issue_description: "",
    preferred_contact: "phone",
    urgency: "normal",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim() || !form.device_type || !form.issue_description.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("repair_requests").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      device_type: form.device_type,
      device_model: form.device_model.trim() || null,
      issue_description: form.issue_description.trim(),
      preferred_contact: form.preferred_contact,
      urgency: form.urgency,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Submission failed", description: "Something went wrong. Please try again.", variant: "destructive" });
      return;
    }

    // Send repair confirmation email
    await supabase.functions.invoke("send-email", {
      body: {
        template: "repair-confirmation",
        to: form.email.trim(),
        data: {
          full_name: form.full_name.trim(),
          device_type: form.device_type,
          device_model: form.device_model.trim(),
          issue_description: form.issue_description.trim(),
          urgency: form.urgency,
          phone: form.phone.trim(),
        },
      },
    });

    toast({ title: "Request submitted!", description: "We will contact you shortly." });
    setForm({
      full_name: "",
      email: "",
      phone: "",
      device_type: "",
      device_model: "",
      issue_description: "",
      preferred_contact: "phone",
      urgency: "normal",
    });
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow";

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
            Request a Repair
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Tell us what needs fixing and we will get back to you fast
          </p>
        </motion.div>
      </section>

      {/* Form */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-[700px] mx-auto bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Submit Your Repair Request</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  className={inputClass}
                  placeholder="Your full name"
                  maxLength={100}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                  placeholder="you@email.com"
                  maxLength={255}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  placeholder="08012345678"
                  maxLength={20}
                  required
                />
              </div>

              {/* Device Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Device Type *</label>
                <select
                  value={form.device_type}
                  onChange={(e) => update("device_type", e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>Select device type</option>
                  {deviceTypes.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Device Model */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Device Brand/Model</label>
                <input
                  type="text"
                  value={form.device_model}
                  onChange={(e) => update("device_model", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. HP Pavilion 15, Samsung Galaxy S24"
                  maxLength={100}
                />
              </div>

              {/* Problem Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Problem Description *</label>
                <textarea
                  value={form.issue_description}
                  onChange={(e) => update("issue_description", e.target.value)}
                  className={`${inputClass} min-h-[120px] resize-y`}
                  placeholder="Describe the issue in detail — what happened, when it started, what you have tried..."
                  maxLength={2000}
                  required
                />
              </div>

              {/* Preferred Contact */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Preferred Contact Method</label>
                <div className="flex flex-wrap gap-4">
                  {contactMethods.map((m) => (
                    <label key={m.value} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                      <input
                        type="radio"
                        name="preferred_contact"
                        value={m.value}
                        checked={form.preferred_contact === m.value}
                        onChange={(e) => update("preferred_contact", e.target.value)}
                        className="accent-accent"
                      />
                      {m.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Urgency Level</label>
                <select
                  value={form.urgency}
                  onChange={(e) => update("urgency", e.target.value)}
                  className={inputClass}
                >
                  {urgencyOptions.map((u) => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg font-bold text-white text-sm transition-opacity disabled:opacity-60 bg-gradient-to-r from-accent to-[hsl(var(--gradient-end))]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send size={16} /> Submit Repair Request
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">What Happens Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="text-center space-y-4"
              >
                <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-white font-extrabold text-lg bg-gradient-to-br from-accent to-[hsl(var(--gradient-end))]">
                  {step.num}
                </div>
                <step.icon size={28} className="mx-auto text-accent" />
                <h3 className="font-bold text-foreground text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Repair;
