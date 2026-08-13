import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simpatia do Congelador Virtual: Afaste Situações e Inveja | Simpatia",
  description:
    "Escreva o drama da sua vida no post-it digital e coloque no nosso congelador virtual. O ritual online perfeito para afastar pessoas e acontecimentos indesejados.",
};

export default function CongeladorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
