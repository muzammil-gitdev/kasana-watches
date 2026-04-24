import HeroCarousel from "@/components/HeroCarousel";
import CategorySection from "@/components/CategorySection";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroCarousel />
      <CategorySection />
      <Newsletter />
    </main>
  );
}
