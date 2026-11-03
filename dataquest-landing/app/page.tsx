import { Analytics } from "@/components/Analytics";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Data } from "@/components/sections/Data";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Game } from "@/components/sections/Game";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Principle } from "@/components/sections/Principle";
import { Problem } from "@/components/sections/Problem";
import { Results } from "@/components/sections/Results";

export default function Home() {
  return (
    <>
      <a href="#contact" className="skip-link">
        Aller au formulaire de contact
      </a>
      <Analytics />
      <Header />
      <main>
        <Hero />
        <Problem />
        <Principle />
        <Game />
        <Data />
        <Results />
        <Pricing />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
