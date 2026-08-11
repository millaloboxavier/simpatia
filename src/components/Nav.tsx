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
    <header className="nav nav-v2">
      <div className="nav-inner">
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="logo-text-v2">
            Simpat<em>ia</em>
          </div>
        </Link>
        <nav className="links">
          <Link href="/blog" className={`navbtn-v2 ${isActive("/blog") ? "active" : ""}`}>
            Blog
          </Link>
          <Link href="/painel" className={`navbtn-v2 ${isActive("/painel") ? "active" : ""}`}>
            Minhas simpatias
          </Link>
          {email ? (
            <button onClick={handleLogout} className="navbtn-v2" title={email}>
              Sair
            </button>
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
