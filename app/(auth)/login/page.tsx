import LoginForm from "./LoginForm";
import type { Metadata } from "next";
import { CGLogoStacked } from "@/app/components/ui/CGMark";

export const metadata: Metadata = {
  title: "Sign In — Common Ground Workshop",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <CGLogoStacked size={80} markColor="white" />
        </div>

        {/* Headline */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 leading-tight mb-3">
            Open Your Toolbox.
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed">
            One secure login that connects you directly to the tools you need.
          </p>
        </div>

        {/* Form */}
        <LoginForm />

        {/* Divider */}
        <div className="mt-10 pt-8 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-700">
            Access is by invitation only.
          </p>
        </div>
      </div>
    </div>
  );
}
