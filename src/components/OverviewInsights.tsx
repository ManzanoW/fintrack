"use client";

import { Transaction } from "@/lib/transactions";

interface OverviewInsightsProps {
  transactions: Transaction[];
}

export function OverviewInsights({ transactions }: OverviewInsightsProps) {
  // Calcula maior categoria
  const categoryTotals = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.type === "saída") {
      const current = categoryTotals.get(t.category) || 0;
      categoryTotals.set(t.category, current + Math.abs(t.amount));
    }
  });

  const totalSpent = Array.from(categoryTotals.values()).reduce(
    (sum, val) => sum + val,
    0,
  );
  const topCategory = Array.from(categoryTotals.entries()).sort(
    (a, b) => b[1] - a[1],
  )[0];

  // Calcula economia
  const totalIn = transactions
    .filter((t) => t.type === "entrada")
    .reduce((sum, t) => sum + t.amount, 0);
  const savings = totalIn - totalSpent;

  return (
    <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 sm:p-6 space-y-4 mt-6">
      <div className="space-y-3 text-sm">
        {topCategory && (
          <p className="flex items-center gap-3 text-zinc-300">
            <span className="text-lg">📊</span>
            <span>
              Seu maior gasto é{" "}
              <span className="font-bold text-zinc-100">{topCategory[0]}</span>{" "}
              <span className="text-zinc-400">
                ({((topCategory[1] / totalSpent) * 100).toFixed(1)}% das saídas)
              </span>
            </span>
          </p>
        )}

        <p className="flex items-center gap-3 text-zinc-300">
          <span className="text-lg">💡</span>
          <span>
            Você economizou{" "}
            <span
              className={`font-bold ${
                savings >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              R$ {Math.abs(savings).toFixed(2)}
            </span>{" "}
            <span className="text-zinc-400">neste período</span>
          </span>
        </p>
      </div>
    </section>
  );
}
