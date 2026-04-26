import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center mb-8">
        <div className="text-3xl font-bold text-indigo-600">💰 ExpenseTracker</div>
      </div>
      <SignInForm />
    </div>
  );
}
