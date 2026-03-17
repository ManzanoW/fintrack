/* Transações */
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "entrada" | "saída";
  category: string;
  date: string; // YYYY-MM-DD
}

export const mockTransactions: Transaction[] = [
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

/** Metas **/
export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string; // YYYY-MM-DD
  category?: string;
  description?: string;
}

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: 1,
    name: "Férias",
    targetAmount: 3000,
    currentAmount: 1200,
    dueDate: "2026-07-01",
    category: "Viagem",
    description: "Poupança para férias de julho",
  },
  {
    id: 2,
    name: "Emergência",
    targetAmount: 5000,
    currentAmount: 3500,
    dueDate: "2026-12-31",
    category: "Fundo de Emergência",
    description: "Fundo de segurança para emergências",
  },
  {
    id: 3,
    name: "Novo Notebook",
    targetAmount: 4000,
    currentAmount: 4000,
    dueDate: "2026-10-15",
    category: "Tecnologia",
    description: "Para upgrade de equipamento",
  },
];
