import { FastifyInstance } from 'fastify';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config/config';
import fp from 'fastify-plugin';

interface CloudflareR2PluginOptions {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

export default fp(async function (
  fastify: FastifyInstance,
  options: CloudflareR2PluginOptions,
  done: (err?: Error) => void
) {
  const { accountId, accessKeyId, secretAccessKey, bucketName } = options;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return done(new Error('Credenciais do Cloudflare R2 são necessárias'));
  }

  // Configurar cliente S3 para Cloudflare R2
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  // Adicionar cliente ao contexto do Fastify
  fastify.decorate('r2', {
    client: s3Client,
    bucketName,

    // Método para fazer upload de arquivo
    async uploadFile(key: string, body: Buffer, contentType: string) {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      });

      return s3Client.send(command);
    },

    // Método para obter URL assinada para download
    async getSignedUrl(key: string, expiresIn = 3600) {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      return getSignedUrl(s3Client, command, { expiresIn });
    },

    // Método para excluir arquivo
    async deleteFile(key: string) {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      return s3Client.send(command);
    },
  });

  done();
});

// Declaração de tipos para TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    r2: {
      client: S3Client;
      bucketName: string;
      uploadFile: (key: string, body: Buffer, contentType: string) => Promise<any>;
      getSignedUrl: (key: string, expiresIn?: number) => Promise<string>;
      deleteFile: (key: string) => Promise<any>;
    };
  }
}
