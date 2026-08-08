"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="logo" style={{ textDecoration: "none" }}>
          <div className="logo-mark">
            <span>S</span>
          </div>
          <div className="logo-text">
            Simpat<em>IA</em>
          </div>
        </Link>
        <nav className="links">
          <Link href="/" className={`navbtn ${isActive("/") ? "active" : ""}`}>
            Início
          </Link>
          <Link href="/congelador" className={`navbtn ${isActive("/congelador") ? "active" : ""}`}>
            Congelador
          </Link>
          <Link href="/painel" className={`navbtn ${isActive("/painel") ? "active" : ""}`}>
            Minhas simpatias
          </Link>
          <Link href="/blog" className={`navbtn ${isActive("/blog") ? "active" : ""}`}>
            Blog
          </Link>
          {email ? (
            <button onClick={handleLogout} className="navbtn" title={email}>
              Sair
            </button>
          ) : (
            <Link href="/login" className={`navbtn ${isActive("/login") ? "active" : ""}`}>
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
