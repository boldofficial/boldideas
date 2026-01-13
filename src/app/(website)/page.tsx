import Hero from "@/components/Hero";
import StorySection from "@/components/StorySection";
import BentoGrid from "@/components/BentoGrid";
import CommunityBlueprint from "@/components/CommunityBlueprint";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <StorySection />
      <BentoGrid />
      <CommunityBlueprint />
      <CTA />
    </div>
  );
}
