import Hero from "@/components/Hero";
import AboutUsSection from "@/components/AboutUsSection";
import ServicesPreview from "@/components/ServicesPreview";
import TargetAudience from "@/components/TargetAudience";
import ReadyMadeSolutions from "@/components/ReadyMadeSolutions";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <AboutUsSection />
      <ServicesPreview />
      <TargetAudience />
      <ReadyMadeSolutions />
      <CTA />
    </div>
  );
}
