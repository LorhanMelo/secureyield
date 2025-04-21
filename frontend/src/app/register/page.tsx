import RegisterForm from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4">
        <h1 className="mb-8 text-3xl font-bold text-center">SecureYield</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
