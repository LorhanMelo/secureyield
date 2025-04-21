import InvestButton from '@/components/dashboard/invest-button';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold text-center">Dashboard SecureYield</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="col-span-1 md:col-span-2">
          <InvestButton />
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Histórico de Operações</h2>
          <p className="text-gray-500">Nenhuma operação realizada ainda.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Informações da Conta</h2>
          <p className="text-gray-700">
            <strong>Nome:</strong> {session?.user?.name || 'Usuário'}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {session?.user?.email || 'email@exemplo.com'}
          </p>
        </div>
      </div>
    </div>
  );
}
