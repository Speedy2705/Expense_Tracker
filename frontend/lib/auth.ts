import { getMe } from "@/lib/api";
import { User } from "@/types/expense";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await getMe();
    return res.data;
  } catch {
    return null;
  }
}
