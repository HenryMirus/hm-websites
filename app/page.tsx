"use client";

import { useState, useEffect } from "react";
import { Lang } from "@/lib/translations";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import ReadinessCheckSection from "@/components/ReadinessCheckSection";
import ScrollRevealText from "@/components/ScrollRevealText";
import ServicesSection from "@/components/ServicesSection";
import LifecycleSection from "@/components/LifecycleSection";
import ProcessSection from "@/components/ProcessSection";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import AboutSection from "@/components/AboutSection";
import TechStackSection from "@/components/TechStackSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SectionNav from "@/components/SectionNav";
import ProjectWizard from "@/components/ProjectWizard";
import ParticleNetwork from "@/components/ParticleNetwork";

export default function Home() {
  const [lang, setLang] = useState<Lang>("de");
  const [wizardOpen, setWizardOpen] = useState(false);

  const openWizard = () => setWizardOpen(true);

  // Honor the ?lang=en hreflang alternate so it actually delivers English content.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("lang") === "en") {
      setLang("en");
    }
  }, []);

  // Keep the <html lang> attribute in sync for screen readers and search engines.
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "de";
  }, [lang]);

  return (
    <div className="min-h-screen">
      {/* Canvas im Hintergrund — zeichnet selbst den dunklen Hintergrund + Partikel */}
      <ParticleNetwork />
      {/* Gesamter Content z-[1] — sitzt über dem Canvas */}
      <div className="relative z-[1]">
        <Navigation lang={lang} setLang={setLang} onOpenWizard={openWizard} />
        <main>
          <HeroSection lang={lang} onOpenWizard={openWizard} />
          <TrustBar lang={lang} />
          <ReadinessCheckSection lang={lang} onOpenWizard={openWizard} />
          <ScrollRevealText lang={lang} />
          <ServicesSection lang={lang} />
          <LifecycleSection lang={lang} />
          <ProcessSection lang={lang} onOpenWizard={openWizard} />
          <PortfolioSection lang={lang} />
          <TestimonialsSection lang={lang} />
          <CTASection lang={lang} onOpenWizard={openWizard} />
          <AboutSection lang={lang} />
          <TechStackSection lang={lang} />
          <FAQSection lang={lang} />
          <ContactSection lang={lang} />
        </main>
        <Footer lang={lang} />
        <SectionNav />
        <ProjectWizard open={wizardOpen} onClose={() => setWizardOpen(false)} lang={lang} />
      </div>
    </div>
  );
}
