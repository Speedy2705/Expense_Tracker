"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import AddExpenseForm from "@/components/expenses/AddExpenseForm";
import ExpenseTable from "@/components/expenses/ExpenseTable";
import ExpenseFilters from "@/components/expenses/ExpenseFilters";
import ExpenseSummary from "@/components/expenses/ExpenseSummary";
import CategorySummaryCards from "@/components/expenses/CategorySummaryCards";
import { Expense } from "@/types/expense";
import { getExpenses, getMe } from "@/lib/api";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userData, expensesData] = await Promise.all([getMe(), getExpenses()]);
      setUser(userData.data);
      setExpenses(expensesData.data);
      setFilteredExpenses(expensesData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    loadData(); // Reload all data to ensure consistency
  };

  const handleExpenseDeleted = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    setFilteredExpenses(filteredExpenses.filter((e) => e.id !== id));
  };

  const handleFilter = (filters: { category?: string; dateFrom?: string; dateTo?: string }) => {
    let filtered = expenses;

    if (filters.category) {
      filtered = filtered.filter((e) => e.category === filters.category);
    }

    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom).getTime();
      filtered = filtered.filter((e) => new Date(e.date).getTime() >= dateFrom);
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo).getTime();
      filtered = filtered.filter((e) => new Date(e.date).getTime() <= dateTo);
    }

    setFilteredExpenses(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar email={user?.email} />
      <div className="min-h-screen bg-gray-100 pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Expense Dashboard</h1>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
            <AddExpenseForm onSuccess={handleExpenseAdded} />
          </div>

          <ExpenseSummary expenses={filteredExpenses} />

          {filteredExpenses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">By Category</h2>
              <CategorySummaryCards expenses={filteredExpenses} />
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Filter Expenses</h2>
            <ExpenseFilters onFilter={handleFilter} />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">All Expenses</h2>
            <ExpenseTable expenses={filteredExpenses} onDelete={handleExpenseDeleted} />
          </div>
        </div>
      </div>
    </>
  );
}
