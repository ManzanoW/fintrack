// app/categories/page.tsx
"use client";

import { useMemo } from "react";
import Header from "../header/Header";
import { Transaction, mockTransactions } from "@/lib/transactions";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function CategoriesPage() {
  const transactions: Transaction[] = mockTransactions;

  const categories = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();

    transactions.forEach((t) => {
      if (t.type !== "saída") return;

      const key = t.category || "Sem categoria";
      const prev = map.get(key) ?? { total: 0, count: 0 };

      map.set(key, {
        total: prev.total + Math.abs(t.amount),
        count: prev.count + 1,
      });
    });

    const arr = Array.from(map.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));

    const grandTotal = arr.reduce((sum, c) => sum + c.total, 0);

    return arr
      .map((c) => ({
        ...c,
        percent: grandTotal ? (c.total / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  const periodLabel = "Período completo"; // depois você pode ligar com filtros globais

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Header />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6 space-y-4">
        {/* Card do gráfico */}
        <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-zinc-200 uppercase tracking-wide">
              Gastos por categoria
            </h2>
            <span className="text-xs text-zinc-500">{periodLabel}</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categories}
                layout="vertical"
                margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fill: "#e4e4e7", fontSize: 11 }}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "0.5rem",
                    color: "#fafafa",
                    padding: "0.5rem 0.75rem",
                  }}
                  formatter={(value: number | string | undefined) => {
                    const n = Number(value ?? 0);
                    return `R$ ${n.toFixed(2)}`;
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="#8b5cf6"
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Lista de categorias */}
        <section className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between bg-zinc-900/60 border border-zinc-800/70 rounded-xl px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-zinc-100">{cat.name}</p>
                <p className="text-xs text-zinc-500">
                  {cat.count} transação{cat.count > 1 ? "es" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-rose-400">
                  R$ {cat.total.toFixed(2)}
                </p>
                <p className="text-xs text-zinc-500">
                  {cat.percent.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="py-4 text-center text-sm text-zinc-500">
              Nenhuma saída cadastrada ainda.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
