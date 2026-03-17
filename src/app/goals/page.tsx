"use client";

import { useState } from "react";
import Header from "../header/Header";
import { SavingsGoal, mockSavingsGoals } from "@/lib/transactions";
import { SavingsGoalCard } from "@/components/SavingGoalCard";

export default function GoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>(mockSavingsGoals);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<SavingsGoal, "id">>({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    dueDate: "",
    category: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      dueDate: "",
      category: "",
      description: "",
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.targetAmount || !formData.dueDate) {
      alert("Preencha os campos obrigatórios: Nome, Valor Alvo e Data");
      return;
    }

    if (editingId) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingId ? { ...formData, id: editingId } : g,
        ),
      );
    } else {
      const newId = Math.max(0, ...goals.map((g) => g.id)) + 1;
      setGoals((prev) => [...prev, { ...formData, id: newId }]);
    }

    resetForm();
  };

  const handleEdit = (goal: SavingsGoal) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      dueDate: goal.dueDate,
      category: goal.category,
      description: goal.description,
    });
    setEditingId(goal.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleToggleForm = () => {
    if (isFormOpen) {
      resetForm();
    } else {
      setIsFormOpen(true);
    }
  };

  const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount);
  const activeGoals = goals.filter((g) => g.currentAmount < g.targetAmount);

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-4 sm:py-6 space-y-4">
        {/* Resumo */}
        {goals.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-1">Total de Metas</p>
                <p className="text-2xl font-semibold text-zinc-100">
                  {goals.length}
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <p className="text-xs text-emerald-400 mb-1">Atingidas</p>
                <p className="text-2xl font-semibold text-emerald-400">
                  {completedGoals.length}
                </p>
              </div>
              <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4">
                <p className="text-xs text-sky-400 mb-1">Em andamento</p>
                <p className="text-2xl font-semibold text-sky-400">
                  {activeGoals.length}
                </p>
              </div>
              <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
                <p className="text-xs text-violet-400 mb-1">Poupado / Alvo</p>
                <p className="text-lg font-semibold text-violet-400">
                  {totalTarget > 0
                    ? ((totalSaved / totalTarget) * 100).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
            </div>

            {/* Botão Nova Meta */}
            <button
              onClick={handleToggleForm}
              className="w-full px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition"
            >
              {isFormOpen ? "Cancelar" : "+ Nova Meta"}
            </button>
          </>
        )}

        {/* Form */}
        {isFormOpen && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Nome da meta *
              </label>
              <input
                type="text"
                placeholder="Ex: Férias, Emergência, Novo Notebook"
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 text-zinc-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Valor alvo (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="5000.00"
                  value={
                    formData.targetAmount === 0 ? "" : formData.targetAmount
                  }
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      targetAmount: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 text-zinc-50"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Já economizado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={
                    formData.currentAmount === 0 ? "" : formData.currentAmount
                  }
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      currentAmount: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 text-zinc-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Data alvo *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, dueDate: e.target.value }))
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 text-zinc-50"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Categoria (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Viagem, Fundo de Emergência"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 text-zinc-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                placeholder="Detalhes sobre essa meta de poupança"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 text-zinc-50 resize-none h-20"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddGoal}
                className="flex-1 px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition"
              >
                {editingId ? "Atualizar Meta" : "Criar Meta"}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Botão Nova Meta (quando vazio) */}
        {goals.length === 0 && !isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition"
          >
            + Nova Meta
          </button>
        )}

        {/* Metas em andamento */}
        {activeGoals.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">
              Em Andamento ({activeGoals.length})
            </h3>
            <div className="space-y-2">
              {activeGoals
                .sort(
                  (a, b) =>
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime(),
                )
                .map((goal) => (
                  <div key={goal.id} className="group">
                    <div className="flex-1">
                      <SavingsGoalCard goal={goal} />
                    </div>
                    <div className="flex justify-center gap-4 sm:gap-2 sm:opacity-0 group-hover:opacity-100 transition sm:pb-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="mt-1 sm:mt-0 text-xs px-3 py-1 rounded bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="mt-1 sm:mt-0 text-xs px-3 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Metas atingidas */}
        {completedGoals.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-emerald-400 uppercase tracking-wide">
              🎯 Atingidas ({completedGoals.length})
            </h3>
            <div className="space-y-2">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="group">
                  <div className="flex-1">
                    <SavingsGoalCard goal={goal} />
                  </div>
                  <div className="flex justify-center gap-4 sm:gap-2 sm:opacity-0 group-hover:opacity-100 transition sm:pb-2">
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="mt-1 sm:mt-0 text-xs px-3 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mensagem vazia */}
        {goals.length === 0 && !isFormOpen && (
          <div className="text-center py-12">
            <p className="text-zinc-500 mb-4">
              Nenhuma meta de poupança criada ainda
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
