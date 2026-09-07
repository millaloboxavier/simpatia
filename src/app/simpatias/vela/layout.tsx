import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vela virtual: acenda uma vela online para seu pedido | Simpatia",
  description:
    "Escolha uma intenção, escreva seu pedido e acenda uma vela virtual — amor, caminhos, paz ou agradecimento. Ela fica simbolicamente acesa por 24 horas.",
};

export default function VelaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
