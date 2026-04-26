import { Expense } from "@/types/expense";

export function formatRupees(amount: string | number): string {
  // Parse to number, format using Intl.NumberFormat with en-IN locale and INR currency
  // Output example: ₹1,234.50
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function sumExpenses(expenses: Expense[]): string {
  // CORRECT approach: convert each amount_rupees string to integer paise using Math.round(parseFloat(x) * 100)
  // Sum all paise as integers (no float arithmetic on currency)
  // Divide total paise by 100 to get rupees
  // Return formatted using formatRupees()
  const totalPaise = expenses.reduce((sum, e) => {
    return sum + Math.round(parseFloat(e.amount_rupees) * 100);
  }, 0);
  return formatRupees(totalPaise / 100);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
