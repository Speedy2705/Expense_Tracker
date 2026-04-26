'use client';

import { Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/money';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export default function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const average = expenses.length > 0 ? total / expenses.length : 0;
  const highest = expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
        <p className="text-3xl font-bold text-blue-600">{formatCurrency(total)}</p>
      </div>

      <div className="bg-green-50 p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600 mb-2">Average Expense</p>
        <p className="text-3xl font-bold text-green-600">{formatCurrency(average)}</p>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg shadow">
        <p className="text-sm text-gray-600 mb-2">Highest Expense</p>
        <p className="text-3xl font-bold text-purple-600">{formatCurrency(highest)}</p>
      </div>
    </div>
  );
}
