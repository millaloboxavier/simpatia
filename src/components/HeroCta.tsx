"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export default function HeroCta() {
  return (
    <Link
      href="#vitrine"
      className="btn-v2"
      onClick={() => trackEvent("cta_fazer_simpatia")}
    >
      Fazer uma Simpatia →
    </Link>
  );
}
