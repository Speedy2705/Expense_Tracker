'use client';

import { Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/money';

interface CategorySummaryCardsProps {
  expenses: Expense[];
}

export default function CategorySummaryCards({ expenses }: CategorySummaryCardsProps) {
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const categoryColors: Record<string, string> = {
    Food: 'bg-orange-50',
    Transportation: 'bg-blue-50',
    Entertainment: 'bg-pink-50',
    Utilities: 'bg-yellow-50',
    Healthcare: 'bg-red-50',
    Other: 'bg-gray-50',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Object.entries(categoryTotals).map(([category, total]) => (
        <div
          key={category}
          className={`${categoryColors[category] || 'bg-gray-50'} p-4 rounded-lg shadow`}
        >
          <p className="text-sm text-gray-600 mb-2">{category}</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
        </div>
      ))}
    </div>
  );
}
