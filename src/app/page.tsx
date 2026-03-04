"use client";
import { useState } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import Header from "./header/Header";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "entrada" | "saída";
  category: string;
  date: string;
}

interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

interface MonthlyData {
  month: string;
  gastos: number;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    description: "Supermercado",
    amount: -150.5,
    type: "saída",
    category: "Alimentação",
    date: "2026-01-01",
  },
  {
    id: 2,
    description: "Salário",
    amount: 3000,
    type: "entrada",
    category: "Salário",
    date: "2026-01-10",
  },
  {
    id: 3,
    description: "Ônibus",
    amount: -25,
    type: "saída",
    category: "Transporte",
    date: "2026-02-09",
  },
  {
    id: 4,
    description: "Freelance",
    amount: 500,
    type: "entrada",
    category: "Freelance",
    date: "2026-02-15",
  },
  {
    id: 5,
    description: "Cinema",
    amount: -40,
    type: "saída",
    category: "Lazer",
    date: "2026-03-20",
  },
  {
    id: 6,
    description: "Aluguel",
    amount: -1200,
    type: "saída",
    category: "Moradia",
    date: "2026-04-05",
  },
  {
    id: 7,
    description: "Salário",
    amount: 3000,
    type: "entrada",
    category: "Salário",
    date: "2026-04-10",
  },
  {
    id: 8,
    description: "Restaurante",
    amount: -80,
    type: "saída",
    category: "Alimentação",
    date: "2026-05-12",
  },
  {
    id: 9,
    description: "Academia",
    amount: -60,
    type: "saída",
    category: "Saúde",
    date: "2026-06-01",
  },
  {
    id: 10,
    description: "Venda de item usado",
    amount: 200,
    type: "entrada",
    category: "Venda",
    date: "2026-06-15",
  },
];

type PeriodOption = "3m" | "6m" | "1y" | "all";

const COLORS: string[] = [
  "#f97373", // vermelho suave
  "#38bdf8", // azul claro
  "#facc15", // amarelo
  "#fb923c", // laranja
  "#4ade80", // verde
];

export default function Dashboard() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [period, setPeriod] = useState<PeriodOption>("3m");

  const now = new Date("2026-06-30");

  const getFilteredTransactions = (): Transaction[] => {
    if (period === "all") return transactions;

    const monthsToSubtract = period === "3m" ? 3 : period === "6m" ? 6 : 12;
    const start = new Date(
      now.getFullYear(),
      now.getMonth() - monthsToSubtract,
      now.getDate(),
    );

    return transactions.filter((t) => new Date(t.date) >= start);
  };

  const totalIn: number = getFilteredTransactions()
    .filter((t) => t.type === "entrada")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalOut: number = Math.abs(
    getFilteredTransactions()
      .filter((t) => t.type === "saída")
      .reduce((acc, t) => acc + t.amount, 0),
  );
  const balance: number = totalIn - totalOut;

  const categoryData: ChartData[] = getFilteredTransactions()
    .filter((t) => t.type === "saída")
    .reduce((acc: ChartData[], t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) {
        existing.value += Math.abs(t.amount);
      } else {
        acc.push({ name: t.category, value: Math.abs(t.amount) });
      }
      return acc;
    }, []);

  const categoryDataWithColor: ChartData[] = categoryData.map(
    (entry, index) => ({
      ...entry,
      fill: COLORS[index % COLORS.length],
    }),
  );

  const monthOrder: Record<string, number> = {
    jan: 1,
    fev: 2,
    mar: 3,
    abr: 4,
    mai: 5,
    jun: 6,
    jul: 7,
    ago: 8,
    set: 9,
    out: 10,
    nov: 11,
    dez: 12,
  };

  const monthlyData: MonthlyData[] = getFilteredTransactions()
    .reduce((acc: MonthlyData[], t) => {
      const [, monthStr] = t.date.split("-");
      const monthIndex = Number(monthStr);

      const monthMap: Record<number, string> = {
        1: "jan",
        2: "fev",
        3: "mar",
        4: "abr",
        5: "mai",
        6: "jun",
        7: "jul",
        8: "ago",
        9: "set",
        10: "out",
        11: "nov",
        12: "dez",
      };

      const month = monthMap[monthIndex];

      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.gastos += Math.abs(t.amount);
      } else {
        acc.push({ month, gastos: Math.abs(t.amount) });
      }
      return acc;
    }, [])
    .sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
      <Header />

      <div className="flex items-center gap-3 text-sm text-zinc-400 justify-end mt-6">
        <span className="hidden sm:inline select-none">Período:</span>
        {[
          { label: "3 meses", value: "3m" },
          { label: "6 meses", value: "6m" },
          { label: "1 ano", value: "1y" },
          { label: "Todos", value: "all" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setPeriod(option.value as PeriodOption)}
            className={`rounded-full px-3 py-1 transition-colors ${
              period === option.value
                ? " border-violet-500 bg-violet-500 text-zinc-100"
                : "border border-zinc-700 hover:border-violet-500 hover:text-zinc-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {/* Cards de resumo */}
      <main className="mx-auto max-w-6xl px-6 py-8 select-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900/60 border border-zinc-800/40 backdrop-blur-sm p-6 rounded-xl shadow-lg text-left hover:scale-[1.02] transition-shadow hover:shadow-emerald-400/50 hover:border-emerald-400/80">
            <span className="text-xs uppercase tracking-wide text-zinc-500">
              Entradas
            </span>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">
              R$ {totalIn.toFixed(2)}
            </p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800/40 backdrop-blur-sm p-6 rounded-xl shadow-lg text-left hover:scale-[1.02] transition-shadow hover:shadow-rose-400/50 hover:border-rose-400/80">
            <span className="text-xs uppercase tracking-wide text-zinc-500">
              Saídas
            </span>
            <p className="mt-2 text-2xl font-semibold text-rose-400">
              R$ {totalOut.toFixed(2)}
            </p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800/40 backdrop-blur-sm p-6 rounded-xl shadow-lg text-left hover:scale-[1.02] transition-shadow hover:shadow-sky-400/50 hover:border-sky-400/80">
            <span className="text-xs uppercase tracking-wide text-zinc-500">
              Saldo
            </span>
            <p
              className={`mt-2 text-2xl font-semibold ${
                balance >= 0 ? "text-sky-400" : "text-rose-400"
              }`}
            >
              R$ {balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pizza por categoria */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 hover:scale-[1.02] transition-transform hover:border-violet-500/40 hover:shadow-violet-400/50 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-zinc-200 uppercase tracking-wide">
                Gastos por Categoria
              </h2>
              <span className="text-xs text-zinc-500">
                {period === "3m"
                  ? "Últimos 3 meses"
                  : period === "6m"
                    ? "Últimos 6 meses"
                    : period === "1y"
                      ? "Último ano"
                      : "Todo período"}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#27272a", // mais claro que o fundo
                    border: "1px solid #3f3f46",
                    borderRadius: "0.5rem",
                    color: "#f9fafb",
                    padding: "0.5rem 0.75rem",
                  }}
                  itemStyle={{
                    color: "#f9fafb",
                  }}
                  formatter={(value: number | string | undefined, name) => {
                    const n = Number(value ?? 0);
                    return [`R$ ${n.toFixed(2)}`, String(name)];
                  }}
                />

                <Pie
                  data={categoryDataWithColor}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Barras por mês */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 hover:scale-[1.02] transition-transform hover:border-violet-500/40 hover:shadow-violet-400/50 hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium mb-4 text-zinc-200 uppercase tracking-wide">
                Gastos por Mês
              </h2>
              <span className="text-xs text-zinc-500">
                {" "}
                {period === "3m"
                  ? "Últimos 3 meses"
                  : period === "6m"
                    ? "Últimos 6 meses"
                    : period === "1y"
                      ? "Último ano"
                      : "Todo período"}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "0.5rem",
                    color: "#fafafa",
                  }}
                  formatter={(value: number | string | undefined) => {
                    const n = Number(value ?? 0);
                    return `R$ ${n.toFixed(2)}`;
                  }}
                />
                <XAxis
                  dataKey="month"
                  stroke="#a1a1aa"
                  tick={{ fill: "#e4e4e7" }}
                />
                <YAxis stroke="#a1a1aa" tick={{ fill: "#e4e4e7" }} />
                <Bar dataKey="gastos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
