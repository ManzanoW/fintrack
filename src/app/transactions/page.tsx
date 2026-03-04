"use client";
import { useMemo, useState } from "react";
import Header from "../header/Header";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "entrada" | "saída";
  category: string;
  date: string; // YYYY-MM-DD
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
];

const categories = [
  "Todos",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Moradia",
  "Salário",
  "Freelance",
];

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);

  const [filters, setFilters] = useState({
    type: "todos", // 'todos' | 'entrada' | 'saída'
    category: "Todos",
    startDate: "",
    endDate: "",
    search: "",
  });

  // lista filtrada (useMemo só por organização)
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.type !== "todos" && t.type !== filters.type) return false;

      if (filters.category !== "Todos" && t.category !== filters.category)
        return false;

      if (filters.startDate) {
        const d = new Date(t.date + "T00:00:00");
        const start = new Date(filters.startDate + "T00:00:00");
        if (d < start) return false;
      }

      if (filters.endDate) {
        const d = new Date(t.date + "T00:00:00");
        const end = new Date(filters.endDate + "T23:59:59");
        if (d > end) return false;
      }

      if (filters.search) {
        const text = filters.search.toLowerCase();
        if (!t.description.toLowerCase().includes(text)) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<Transaction, "id">>({
    description: "",
    amount: 0,
    type: "saída",
    category: "Alimentação",
    date: "",
  });

  const resetForm = () => {
    setFormData({
      description: "",
      amount: 0,
      type: "saída",
      category: "Alimentação",
      date: "",
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.date || formData.amount === 0) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    if (editingId) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...formData, id: editingId } : t,
        ),
      );
    } else {
      const newId = Math.max(0, ...transactions.map((t) => t.id)) + 1;
      setTransactions((prev) => [...prev, { ...formData, id: newId }]);
    }

    resetForm();
  };

  const handleEdit = (t: Transaction) => {
    setFormData({
      description: t.description,
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: t.date,
    });
    setEditingId(t.id);
  };

  const handleDelete = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-6 space-y-2">
        {/* Formulário de nova transação / edição */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-zinc-100 uppercase tracking-wide">
              {editingId ? "Editar transação" : "Nova transação"}
            </h2>
            {editingId && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/40">
                Modo edição
              </span>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-3 md:grid-cols-6 items-end"
          >
            {/* 1ª linha: descrição + valor */}
            <div className="md:col-span-3">
              <label className="block text-xs text-zinc-400 mb-1">
                Descrição
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                placeholder="Ex: Supermercado"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs text-zinc-400 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount === 0 ? "" : formData.amount}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, amount: Number(e.target.value) }))
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500 "
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    type: e.target.value as "entrada" | "saída",
                  }))
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
              >
                <option value="entrada">Entrada</option>
                <option value="saída">Saída</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
              >
                {categories
                  .filter((c) => c !== "Todos")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>

            {/* Data + botão na mesma linha */}
            <div className="md:col-span-2 flex items-end gap-3 justify-end">
              <div className="flex-1">
                <label className="block text-xs text-zinc-400 mb-1">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, date: e.target.value }))
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex gap-2 ">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs px-3 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="text-xs px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-medium hover:cursor-pointer transition "
                >
                  {editingId ? "Salvar" : "Adicionar"}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Filtros */}
        <section className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3">
          <h2 className="text-sm font-medium text-zinc-200 mb-3 uppercase tracking-wide">
            Filtros
          </h2>
          <div className="grid gap-3 md:grid-cols-4">
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((f) => ({ ...f, type: e.target.value }))
              }
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
            >
              <option value="todos">Todos os tipos</option>
              <option value="entrada">Entradas</option>
              <option value="saída">Saídas</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, startDate: e.target.value }))
              }
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, endDate: e.target.value }))
              }
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
            />
          </div>

          <div className="mt-3 flex flex-col md:flex-row gap-3 justify-between">
            <input
              type="text"
              placeholder="Buscar por descrição..."
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500"
            />
            <button
              onClick={() =>
                setFilters({
                  type: "todos",
                  category: "Todos",
                  startDate: "",
                  endDate: "",
                  search: "",
                })
              }
              className="text-sm px-3 py-2 rounded-lg border border-zinc-700 hover:border-violet-500 hover:text-zinc-100 transition"
            >
              Limpar filtros
            </button>
          </div>
        </section>

        {/* Tabela */}
        <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-zinc-200 uppercase tracking-wide">
              Lista de Transações
            </h2>
            <span className="text-xs text-zinc-500">
              {filteredTransactions.length} registro(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-2 px-2 text-left">Data</th>
                  <th className="py-2 px-2 text-left">Descrição</th>
                  <th className="py-2 px-2 text-left">Categoria</th>
                  <th className="py-2 px-2 text-right">Tipo</th>
                  <th className="py-2 px-2 text-right">Valor</th>
                  <th className="py-2 px-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-2 px-2 text-zinc-300">
                      {new Date(t.date + "T00:00:00").toLocaleDateString(
                        "pt-BR",
                      )}
                    </td>
                    <td className="py-2 px-2 text-zinc-100">{t.description}</td>
                    <td className="py-2 px-2 text-zinc-300">{t.category}</td>
                    <td className="py-2 px-2 text-right">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          t.type === "entrada"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {t.type === "entrada" ? "Entrada" : "Saída"}
                      </span>
                    </td>
                    <td
                      className={`py-2 px-2 text-right font-medium ${
                        t.type === "entrada"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {t.type === "entrada" ? "+" : "-"} R${" "}
                      {Math.abs(t.amount).toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-xs text-zinc-400 hover:text-rose-400"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-sm text-zinc-500"
                    >
                      Nenhuma transação encontrada para os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div
            className={`mt-4 text-right text-sm ${filteredTransactions.length > 0 ? "text-zinc-200" : "text-zinc-500"} font-medium`}
          >
            Total:{" "}
            {filteredTransactions
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </div>
        </section>
      </main>
    </div>
  );
}
