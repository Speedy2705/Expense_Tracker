import axios, { AxiosResponse } from "axios";
import { User, Expense, CreateExpenseInput } from "@/types/expense";

// Create an axios instance with baseURL = process.env.NEXT_PUBLIC_API_URL and withCredentials: true
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Add a response interceptor:
// - On success: pass through
// - On error: if error.response?.status === 401, check window.location.pathname
//   - If NOT on "/signin" or "/signup", do window.location.href = "/signin"
// - Always return Promise.reject(err) after handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const pathname = window.location.pathname;
      if (pathname !== "/signin" && pathname !== "/signup") {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);

// Export these typed async functions (all use the axios instance):
export async function signUp(email: string, password: string): Promise<AxiosResponse<User>> {
  return api.post("/auth/signup", { email, password });
}

export async function signIn(email: string, password: string): Promise<AxiosResponse<User>> {
  return api.post("/auth/signin", { email, password });
}

export async function signOut(): Promise<AxiosResponse<void>> {
  return api.post("/auth/signout");
}

export async function getMe(): Promise<AxiosResponse<User>> {
  return api.get("/auth/me");
}

export async function createExpense(data: CreateExpenseInput): Promise<AxiosResponse<Expense>> {
  return api.post("/expenses", data, {
    headers: {
      "Idempotency-Key": data.idempotency_key,
    },
  });
}

export async function getExpenses(category?: string): Promise<AxiosResponse<Expense[]>> {
  const params: Record<string, string> = { sort: "date_desc" };
  if (category && category !== "All") {
    params.category = category;
  }
  return api.get("/expenses", { params });
}

export async function deleteExpense(id: string): Promise<AxiosResponse<void>> {
  return api.delete(`/expenses/${id}`);
}
