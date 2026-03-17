"use client";

import { SavingsGoal } from "@/lib/transactions";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

export function SavingsGoalCard({ goal }: SavingsGoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = Math.ceil(
    (new Date(goal.dueDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isCompleted
          ? "bg-emerald-500/10 border-emerald-500/30"
          : "bg-zinc-900/60 border-zinc-800/70"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-100">{goal.name}</h3>
            {isCompleted && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                🎯 Atingida
              </span>
            )}
          </div>
          {goal.description && (
            <p className="text-xs text-zinc-500 mt-1">{goal.description}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-sky-400">
            R$ {goal.currentAmount.toFixed(2)}
          </p>
          <p className="text-xs text-zinc-500">
            de R$ {goal.targetAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all ${
            progress >= 100
              ? "bg-emerald-500"
              : progress >= 75
                ? "bg-sky-500"
                : progress >= 50
                  ? "bg-amber-400"
                  : "bg-violet-500"
          }`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Info footer */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>{progress.toFixed(0)}% concluído</span>
        {!isCompleted && (
          <span className="text-emerald-400">
            {daysLeft > 0 ? `${daysLeft} dias restantes` : "Prazo expirado"}
          </span>
        )}
      </div>

      {!isCompleted && remaining > 0 && (
        <div className="mt-2 pt-2 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-400">
            Faltam{" "}
            <span className="font-semibold text-zinc-100">
              R$ {remaining.toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
