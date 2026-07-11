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
    "Common Ground Workshop builds custom websites for small businesses across Utah — from Logan to St. George. We handle domain registration, business email, website design and launch, and Google Business Profile setup.",
  telephone: "+18015498258",
  email: "hello@cg-workshop.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Layton",
    addressRegion: "UT",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "State",
    name: "Utah",
  },
  serviceType: [
    "Web Design",
    "Website Design",
    "Custom Website Development",
    "Small Business Website",
    "Google Business Profile Setup",
    "Domain Registration",
    "Business Email Setup",
    "Appointment Scheduling Software",
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
