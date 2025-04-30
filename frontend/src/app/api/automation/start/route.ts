import { NextRequest, NextResponse } from 'next/server';
import { AutomationService } from '@/lib/automation/automation-service';

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação (em um cenário real, isso seria feito com um middleware)
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    // }

    // Simular usuário autenticado para demonstração
    const userId = 'user-123';
    
    // Obter parâmetros da requisição
    const body = await req.json();
    
    // Criar serviço de automação
    const automationService = new AutomationService();
    
    // Iniciar automação em background
    // Na implementação real, isso seria feito em um worker separado
    // para não bloquear a resposta HTTP
    setTimeout(async () => {
      try {
        await automationService.runAutomation({
          userId,
          parameters: body.parameters || {},
        });
      } catch (error) {
        console.error('Erro na execução da automação:', error);
      }
    }, 100);
    
    // Retornar resposta imediata
    return NextResponse.json({
      success: true,
      message: 'Automação iniciada com sucesso',
      automationId: `auto-${Date.now()}`,
    }, { status: 202 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro ao iniciar automação:', error);
    return NextResponse.json({ 
      error: 'Erro ao iniciar automação', 
      details: error.message 
    }, { status: 500 });
  }
}
