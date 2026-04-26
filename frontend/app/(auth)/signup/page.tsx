import SignUpForm from '@/components/auth/SignUpForm';
import Navbar from '@/components/ui/Navbar';

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
          <SignUpForm />
        </div>
      </div>
    </>
  );
}
