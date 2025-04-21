import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container px-4 py-16 mx-auto text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl">
          SecureYield
        </h1>
        <p className="max-w-2xl mx-auto mb-8 text-xl">
          Automatize suas operações financeiras no mercado de renda fixa secundária com segurança e eficiência.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="/login">
              Acessar Plataforma
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
            <Link href="/register">
              Criar Conta
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-3">
          <div className="p-6 bg-slate-800 rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Automatização Inteligente</h2>
            <p className="text-slate-300">
              Nossa plataforma automatiza todo o processo de investimento em renda fixa secundária, 
              eliminando erros humanos e maximizando seus retornos.
            </p>
          </div>
          <div className="p-6 bg-slate-800 rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Segurança Garantida</h2>
            <p className="text-slate-300">
              Todas as operações são realizadas com os mais altos padrões de segurança, 
              protegendo seus dados e investimentos.
            </p>
          </div>
          <div className="p-6 bg-slate-800 rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Facilidade de Uso</h2>
            <p className="text-slate-300">
              Interface intuitiva que permite iniciar suas operações com apenas um clique 
              no botão "Invista Já".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
