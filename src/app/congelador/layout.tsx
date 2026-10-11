import type { Metadata } from "next";
import { SITE_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Simpatia do Congelador Virtual: Afaste Situações e Inveja | Simpatia",
  description:
    "Escreva o drama da sua vida no post-it digital e coloque no nosso congelador virtual. O ritual online perfeito para afastar pessoas e acontecimentos indesejados.",
  alternates: { canonical: `${SITE_URL}/congelador` },
};

export default function CongeladorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
