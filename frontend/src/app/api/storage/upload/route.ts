import { NextRequest, NextResponse } from 'next/server';
import { CloudflareR2Service } from '@/lib/storage/cloudflare-r2';

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação (em um cenário real, isso seria feito com um middleware)
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    // }
    
    // Obter arquivo da requisição
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }
    
    // Configurar serviço do Cloudflare R2
    const r2Service = new CloudflareR2Service({
      accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID || '',
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
      bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'secureyield-bucket',
    });
    
    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    
    // Converter arquivo para buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Fazer upload do arquivo
    const result = await r2Service.uploadFile(fileName, buffer, file.type);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      fileName,
      url: result.url,
      contentType: file.type,
      size: file.size,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro ao fazer upload de arquivo:', error);
    return NextResponse.json({ 
      error: 'Erro ao fazer upload de arquivo', 
      details: error.message 
    }, { status: 500 });
  }
}
