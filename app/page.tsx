import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Hero from "@/app/components/sections/Hero";
import Philosophy from "@/app/components/sections/Philosophy";
import Products from "@/app/components/sections/Products";
import Principles from "@/app/components/sections/Principles";
import Process from "@/app/components/sections/Process";
import Contact from "@/app/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Products />
        <Principles />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
