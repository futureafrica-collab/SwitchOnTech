import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Last updated: March 2026
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-3xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When you use our website, purchase products, request repairs, or contact us, we may collect the following personal information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1.5 ml-2">
              <li>Full name, email address, and phone number</li>
              <li>Delivery address for product orders</li>
              <li>Device information submitted for repair requests</li>
              <li>Payment information processed through our payment provider</li>
              <li>Browser type, IP address, and usage data collected automatically</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to process your orders and repair requests, communicate with you about your purchases, improve our website and services, send promotional updates (only with your consent), respond to your enquiries via our contact form or live chat, and comply with legal obligations under Nigerian law.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take the security of your personal data seriously. We implement industry-standard security measures including SSL encryption, secure payment processing, and access controls to protect your information from unauthorised access, alteration, disclosure, or destruction. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyse website traffic, and understand where our visitors come from. You can control cookie settings through your browser preferences. Disabling cookies may affect certain functionality of our website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use the following third-party services that may collect and process your data:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1.5 ml-2">
              <li><strong>Paystack</strong> — for secure payment processing. Paystack's privacy policy governs the handling of your payment information.</li>
              <li><strong>Tawk.to</strong> — for live chat support. Tawk.to may collect your chat messages, IP address, and browser information to provide customer service.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We recommend reviewing the privacy policies of these third-party services for more information on how they handle your data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              In accordance with the Nigeria Data Protection Regulation (NDPR), you have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your personal data, withdraw consent for data processing at any time, and lodge a complaint with the relevant data protection authority. To exercise any of these rights, please contact us using the details below.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 text-muted-foreground space-y-1">
              <p><strong>Switchon Tech — Complete ICT Center</strong></p>
              <p>Branch 1: 19 Ashimawu Street, Gbagada New Garage, Beside R-Jolad Hospital, Lagos</p>
              <p>Branch 2: Suite 32, Abraham Adesanya Shopping Mall, Onipanu, Lagos</p>
              <p>Phone: 08050624942 / 08040085353</p>
              <p>Email: info@switchontech.com</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
