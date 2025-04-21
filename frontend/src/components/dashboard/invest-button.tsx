'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function InvestButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInvest = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Chamar a API para iniciar a automação
      const response = await fetch('/api/automation/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao iniciar automação');
      }

      // Redirecionar para a página de status da automação
      router.push(`/automation/status/${data.automationId}`);
    } catch (error) {
      setError('Ocorreu um erro ao iniciar a automação. Tente novamente.');
      console.error('Erro ao iniciar automação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Investimento Automatizado</CardTitle>
        <CardDescription className="text-center">
          Inicie o processo de investimento automatizado em renda fixa secundária
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Button 
          onClick={handleInvest} 
          className="w-full max-w-xs py-6 text-xl" 
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? 'Iniciando...' : 'Invista Já'}
        </Button>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-center text-gray-500">
          Este processo irá automatizar suas operações de investimento em renda fixa secundária
        </p>
      </CardFooter>
    </Card>
  );
}
