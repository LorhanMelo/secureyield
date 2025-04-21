import { NextRequest, NextResponse } from 'next/server';

// Simulação de banco de dados em memória para demonstração
const automationStore: Record<string, any> = {};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Verificar autenticação (em um cenário real, isso seria feito com um middleware)
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    // }
    
    // Buscar automação pelo ID
    // Em um cenário real, isso seria buscado do banco de dados
    const automation = automationStore[id] || {
      userId: 'user-123',
      status: Math.random() > 0.7 ? 'completed' : 'running',
      startTime: new Date(Date.now() - 60000).toISOString(),
      endTime: Math.random() > 0.7 ? new Date().toISOString() : undefined,
      result: Math.random() > 0.7 ? { success: true, message: 'Automação concluída com sucesso' } : undefined,
      createdAt: new Date(Date.now() - 60000).toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Salvar na store simulada
    automationStore[id] = automation;
    
    return NextResponse.json({ automation });
  } catch (error: any) {
    console.error('Erro ao buscar status da automação:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar status da automação', 
      details: error.message 
    }, { status: 500 });
  }
}
