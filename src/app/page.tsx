import Navbar from "@/components/homepage/Navbar";
import HeroSection from "@/components/homepage/HeroSection";
import StatsBar from "@/components/homepage/StatsBar";
import HowItWorks from "@/components/homepage/HowItWorks";
import BankPartners from "@/components/homepage/BankPartners";
import Benefits from "@/components/homepage/Benefits";
import Testimonials from "@/components/homepage/Testimonials";
import TeamSection from "@/components/homepage/TeamSection";
import CredibilityNumbers from "@/components/homepage/CredibilityNumbers";
import FAQ from "@/components/homepage/FAQ";
import CTAFinal from "@/components/homepage/CTAFinal";
import Footer from "@/components/homepage/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <BankPartners />
      <Benefits />
      <Testimonials />
      <TeamSection />
      <CredibilityNumbers />
      <FAQ />
      <CTAFinal />
      <Footer />
    </main>
  );
}
