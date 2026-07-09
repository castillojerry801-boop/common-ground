import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Get in Touch — Common Ground Workshop",
  description:
    "Tell us about your business. Common Ground Workshop builds profession-specific software for small businesses — let's talk about what you need.",
};

export default function ContactPage() {
  return <ContactForm />;
}
