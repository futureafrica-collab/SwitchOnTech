import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="SwitchOn Tech" className="h-10 w-10 rounded-md object-cover" />
              <span className="font-bold text-lg">SwitchOn Tech</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Your complete ICT center for repairs, networking, security, training, and computer sales in Nigeria.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {["Home", "About", "Blog", "Contact", "Shop"].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/70">
              <li>Networking Setup</li>
              <li>System Repair</li>
              <li>CCTV & Security</li>
              <li>ICT Training</li>
              <li>Computer Sales</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 shrink-0" />
                08050624942 / 08040085353
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0" />
                info@switchontech.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span><strong>Branch 1:</strong> 19 Ashimawu Street Gbagada New Garage, Beside R-Jolad Hospital, Lagos</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span><strong>Branch 2:</strong> Suite 32, Abraham Adesanya Shopping Mall, Onipanu, Lagos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-primary-foreground/50">
            <p>© 2026 Switchon Tech. All rights reserved.</p>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <Link to="/privacy-policy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms-of-service" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
          <a
            href="https://wa.me/2348050624942"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-80"
            style={{ background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--gradient-end)))" }}
            aria-label="WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
