"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const linkBase = "hover:text-zinc-100 transition-colors";
  const linkActive = "font-medium text-zinc-100";
  const linkInactive = "text-zinc-400";

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex items-center gap-6 text-sm text-zinc-400">
      <Link
        href="/"
        className={`${linkBase} ${isActive("/") ? linkActive : linkInactive}`}
      >
        Visão geral
      </Link>
      <Link
        href="/transactions"
        className={`${linkBase} ${isActive("/transactions") ? linkActive : linkInactive}`}
      >
        Transações
      </Link>
      <Link
        href="/categories"
        className={`${linkBase} ${isActive("/categories") ? linkActive : linkInactive}`}
      >
        Categorias
      </Link>
    </nav>
  );
}
