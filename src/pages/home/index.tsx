import { useEffect } from "react";
import Navigation from "./_component/navigation";
import HeroSection from "./_component/hero-section";
import MarqueeSection from "./_component/marquee-section";
import FeaturesSection from "./_component/features-section";
import HowItWorksSection from "./_component/how-it-works-section";
import MobileSection from "./_component/mobile-section";
import CtaSection from "./_component/cta-section";
import Footer from "./_component/footer";

const Home = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen home-page-background home-page-wrapper">
      <Navigation
        scrollToSection={scrollToSection}
        scrollToTop={scrollToTop}
      />
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MobileSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Home;
