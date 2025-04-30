import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const automationStore: Record<string, any> = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, context: any) {
  try {
    const id = context.params.id;

    const automation = automationStore[id] || {
      userId: 'user-123',
      status: Math.random() > 0.7 ? 'completed' : 'running',
      startTime: new Date(Date.now() - 60000).toISOString(),
      endTime: Math.random() > 0.7 ? new Date().toISOString() : undefined,
      result: Math.random() > 0.7 ? { success: true, message: 'Automação concluída com sucesso' } : undefined,
      createdAt: new Date(Date.now() - 60000).toISOString(),
      updatedAt: new Date().toISOString()
    };

    automationStore[id] = automation;

    return NextResponse.json({ automation });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro ao buscar status da automação:', error);
    return NextResponse.json(
        { error: 'Erro ao buscar status da automação', details: error.message },
        { status: 500 }
    );
  }
}
