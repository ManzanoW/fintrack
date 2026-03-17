"use client";

import { SavingsGoal, mockSavingsGoals } from "@/lib/transactions";
import { SavingsGoalCard } from "./SavingGoalCard";
import Link from "next/link";

export function SavingsGoalsOverview() {
  const goals = mockSavingsGoals;
  const completedGoals = goals.filter(
    (g) => g.currentAmount >= g.targetAmount,
  ).length;
  const totalGoals = goals.length;

  const sortedGoals = [...goals]
    .sort((a, b) => {
      // Prioriza metas incompletas
      const aComplete = a.currentAmount >= a.targetAmount;
      const bComplete = b.currentAmount >= b.targetAmount;
      if (aComplete === bComplete) {
        // Dentro da mesma categoria, por data
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return aComplete ? 1 : -1;
    })
    .slice(0, 3); // Mostra top 3

  return (
    <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-zinc-200 uppercase tracking-wide">
          Metas de Poupança
        </h2>
        <Link
          href="/goals"
          className="text-xs text-zinc-500 hover:text-violet-400 transition"
        >
          Ver todas →
        </Link>
      </div>

      <div className="mb-4 p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
        <p className="text-xs text-zinc-500">
          <span className="text-emerald-400 font-semibold">
            {completedGoals}
          </span>{" "}
          de <span className="text-zinc-100 font-semibold">{totalGoals}</span>{" "}
          metas atingidas
        </p>
      </div>

      <div className="space-y-2">
        {sortedGoals.map((goal) => (
          <SavingsGoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </section>
  );
}
