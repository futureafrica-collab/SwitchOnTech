import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const TermsOfService = () => {
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
            Terms of Service
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Use of Website</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the Switchon Tech website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this website. We reserve the right to modify these terms at any time, and your continued use of the website constitutes acceptance of any changes. You must be at least 18 years of age or have parental consent to use our services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Services and Payment Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Switchon Tech provides ICT services including but not limited to computer repairs, networking setup, CCTV installation, ICT training, and the sale of computers and accessories. All prices displayed on our website are in Nigerian Naira (₦) and are subject to change without prior notice.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Payment for products is processed securely through Paystack. For repair services, a diagnostic fee may apply and will be communicated before any work begins. Full payment is required before completed repairs or purchased items are released. Refunds are handled on a case-by-case basis — products may be returned within 7 days of purchase if they are unused and in their original packaging, subject to a restocking fee.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              For repair services, we provide a 30-day warranty on parts replaced and labour performed. This warranty does not cover damage caused by misuse, power surges, liquid damage, or unauthorised modifications after the repair.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Switchon Tech shall not be held liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services. Our total liability for any claim arising from our services shall not exceed the amount you paid for the specific service or product in question. We are not responsible for data loss on devices submitted for repair — customers are advised to back up all data before submitting devices. We make no warranties, expressed or implied, regarding the availability, accuracy, or reliability of our website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website — including text, graphics, logos, images, and software — is the property of Switchon Tech and is protected by Nigerian copyright and intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on this website without our prior written consent. The Switchon Tech name, logo, and branding are trademarks of Switchon Tech and may not be used without permission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from or related to these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts in Lagos State, Nigeria. If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfService;
