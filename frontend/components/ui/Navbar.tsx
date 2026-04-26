"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/api";

interface NavbarProps {
  email?: string;
}

export default function Navbar({ email }: NavbarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-3 z-10">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-indigo-600">💰 ExpenseTracker</div>
        <div className="flex items-center gap-4">
          {email && <span className="text-sm text-gray-500">{email}</span>}
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
