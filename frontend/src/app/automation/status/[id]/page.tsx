'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AutomationStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  result?: any;
  error?: string;
}

export default function AutomationStatusPage() {
  const { id } = useParams();
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/automation/status/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Falha ao buscar status da automação');
        }

        setStatus(data.automation);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar status da automação');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Atualizar status a cada 5 segundos se ainda estiver em andamento
    const interval = setInterval(() => {
      if (status?.status === 'pending' || status?.status === 'running') {
        fetchStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, status?.status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'running':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'running':
        return 'Em execução';
      case 'completed':
        return 'Concluído';
      case 'failed':
        return 'Falhou';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold text-center">Status da Automação</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-center text-red-500">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
        </Card>
      ) : status ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Automação #{id}
            </CardTitle>
            <CardDescription className="text-center">
              Iniciada em {new Date(status.startTime).toLocaleString('pt-BR')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <span className="font-medium">Status:</span>
              <span className={`font-bold ${getStatusColor(status.status)}`}>
                {getStatusText(status.status)}
              </span>
            </div>
            
            {status.endTime && (
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <span className="font-medium">Concluída em:</span>
                <span>{new Date(status.endTime).toLocaleString('pt-BR')}</span>
              </div>
            )}
            
            {status.result && (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Resultado:</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(status.result, null, 2)}
                </pre>
              </div>
            )}
            
            {status.error && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <h3 className="font-medium mb-2 text-red-700">Erro:</h3>
                <p className="text-red-600">{status.error}</p>
              </div>
            )}
            
            {(status.status === 'pending' || status.status === 'running') && (
              <div className="flex justify-center mt-4">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-pulse"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-center text-yellow-500">Não encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Automação não encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
