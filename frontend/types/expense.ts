export interface Expense {
  id: string;
  amount_rupees: string;  // ALWAYS a string like "199.50" — never a number
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface CreateExpenseInput {
  amount_rupees: number;
  category: string;
  description: string;
  date: string;
  idempotency_key: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}
