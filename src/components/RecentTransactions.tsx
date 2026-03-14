"use client";

import Link from "next/link";
import { Transaction } from "@/lib/transactions";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 sm:p-5 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-200 uppercase tracking-wide">
          Últimas transações
        </h3>
        <Link
          href="/transactions"
          className="text-xs text-zinc-500 hover:text-violet-400 transition"
        >
          Ver todas →
        </Link>
      </div>

      <div className="space-y-2">
        {recent.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/40 transition"
          >
            <div>
              <p className="text-xs font-medium text-zinc-100">
                {t.description}
              </p>
              <p className="text-[11px] text-zinc-500">
                {new Date(t.date + "T00:00:00").toLocaleDateString("pt-BR")}
              </p>
            </div>
            <p
              className={`text-xs font-semibold ${
                t.type === "entrada" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {t.type === "entrada" ? "+" : "-"} R${" "}
              {Math.abs(t.amount).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
