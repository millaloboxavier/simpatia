import type { Metadata } from "next";
import { SITE_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Simpatia de Soprar Canela Virtual: Atraia Dinheiro e Prosperidade | Simpatia",
  description:
    "Escreva sua intenção, sopre a canela virtual e atraia dinheiro, oportunidades e abundância. Faça o ritual online de prosperidade e sorte.",
  alternates: { canonical: `${SITE_URL}/simpatias/atrair` },
};

export default function AtrairLayout({ children }: { children: React.ReactNode }) {
  return children;
}
