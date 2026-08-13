"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LOGO_URL } from "@/lib/brand";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="nav nav-v2">
      <div className="nav-inner">
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt="Simpatia" style={{ height: 34, width: "auto" }} />
        </Link>
        <nav className="links">
          <Link href="/blog" className={`navbtn-v2 ${isActive("/blog") ? "active" : ""}`}>
            Blog
          </Link>
          <Link href="/painel" className={`navbtn-v2 ${isActive("/painel") ? "active" : ""}`}>
            Minhas simpatias
          </Link>
          {email ? (
            <>
              <Link href="/conta" className={`navbtn-v2 ${isActive("/conta") ? "active" : ""}`} title={email}>
                Minha conta
              </Link>
              <button onClick={handleLogout} className="navbtn-v2">
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="navbtn-v2 cta">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
