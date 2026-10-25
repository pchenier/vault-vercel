import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Integrations } from "@/components/integrations";
import { ScrollStory } from "@/components/scroll-story";
import { Stats } from "@/components/stats";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { Cta } from "@/components/cta";

export default function Home() {
  return (
    <>
      <div aria-hidden className="noise pointer-events-none fixed inset-0 z-[60]" />
      <Nav />
      <main>
        <Hero />
        <Integrations />
        <ScrollStory />
        <Stats />
        <Features />
        <Pricing />
        <Cta />
      </main>
    </>
  );
}
