import Image from "next/image";

import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import CategorySection from "@/components/CategorySection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />
      <CategorySection />
      <Newsletter />
      <Footer />
    </main>
  );
}
