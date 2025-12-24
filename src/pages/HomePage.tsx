import { useEffect } from "react";
import AboutSection from "@/components/homepage/AboutSection";
import BenefitsSection from "@/components/homepage/BenefitsSection";
import CTASection from "@/components/homepage/CTASection";
import Experience from "@/components/homepage/Experience";
import FAQs from "@/components/homepage/FAQs";
import FinalCTASection from "@/components/homepage/FinalCTASection";
import Footer from "@/components/homepage/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import Incentive from "@/components/homepage/Incentive";
import ProductGallerySection from "@/components/homepage/ProductGallerySection";
import TrailerSection from "@/components/homepage/TrailerSection";
import ScrollToTop from "@/components/ScrollToTop";
import MainHeader from "@/components/MainHeader";

export default function HomePage() {
  // Handle hash navigation (e.g., /#about, /#faq)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Remove the # from the hash
      const elementId = hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        // Small delay to ensure page is rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MainHeader />
      <HeroSection />
      <AboutSection />
      <Experience />
      <BenefitsSection />
      <ProductGallerySection />
      <Incentive />
      <TrailerSection />
      <CTASection />
      <FAQs />
      <FinalCTASection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
