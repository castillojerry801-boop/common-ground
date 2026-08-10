import type { Metadata } from "next";
import IntakeForm from "./IntakeForm";

export const metadata: Metadata = {
  title: "Start a Project — Common Ground Workshop",
  description:
    "Tell us everything about your business and vision. This intake form helps us hit the ground running.",
};

export default function IntakePage() {
  return <IntakeForm />;
}
