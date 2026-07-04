import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Hero from "@/app/components/sections/Hero";
import Philosophy from "@/app/components/sections/Philosophy";
import Products from "@/app/components/sections/Products";
import CGScheduler from "@/app/components/sections/CGScheduler";
import Principles from "@/app/components/sections/Principles";
import Process from "@/app/components/sections/Process";
import Included from "@/app/components/sections/Included";
import Contact from "@/app/components/sections/Contact";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Common Ground Workshop",
  url: "https://cg-workshop.com",
  logo: "https://cg-workshop.com/cg-badge.png",
  image: "https://cg-workshop.com/cg-brand.png",
  description:
    "Common Ground Workshop builds profession-specific software for small businesses — scheduling, client management, payments, and more.",
  telephone: "+18015498258",
  email: "hello@cg-workshop.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Salt Lake City",
    addressRegion: "UT",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "State",
    name: "Utah",
  },
  serviceType: [
    "Custom Software Development",
    "Appointment Scheduling Software",
    "Business Management Software",
    "Website Development",
    "Mobile App Development",
  ],
  sameAs: ["https://cg-workshop.com"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Products />
        <CGScheduler />
        <Principles />
        <Process />
        <Included />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
