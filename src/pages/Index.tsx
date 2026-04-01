import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ScrollProgressBar />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WhyChooseUs />
      <Testimonials />
      <BlogPreview />
      <Footer />
    </div>
  );
};

export default Index;
