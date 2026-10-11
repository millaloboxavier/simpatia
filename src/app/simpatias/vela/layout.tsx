import type { Metadata } from "next";
import { SITE_URL } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Vela virtual: acenda uma vela online para seu pedido | Simpatia",
  description:
    "Escolha uma intenção, escreva seu pedido e acenda uma vela virtual — amor, caminhos, paz ou agradecimento. Fica simbolicamente acesa por 1, 3 ou 7 dias.",
  alternates: { canonical: `${SITE_URL}/simpatias/vela` },
};

export default function VelaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
