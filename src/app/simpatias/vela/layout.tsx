import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acenda uma Vela Virtual: Simpatia para Qualquer Intenção | Simpatia",
  description:
    "Escolha uma intenção, escreva seu pedido e acenda uma vela virtual — amor, caminhos, paz ou agradecimento. Ela fica simbolicamente acesa por 24 horas.",
};

export default function VelaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
