export interface Expense {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  amount: number;
  category: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}
