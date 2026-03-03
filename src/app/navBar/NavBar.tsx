import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center gap-6 text-sm text-zinc-400">
      <Link href="/" className="hover:text-zinc-100 transition-colors">
        Visão geral
      </Link>
      <Link
        href="/transactions"
        className="hover:text-zinc-100 transition-colors font-medium"
      >
        Transações
      </Link>
      <Link
        href="/categories"
        className="hover:text-zinc-100 transition-colors"
      >
        Categorias
      </Link>
    </nav>
  );
}
