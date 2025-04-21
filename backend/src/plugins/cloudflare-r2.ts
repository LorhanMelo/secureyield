import { FastifyPluginAsync } from 'fastify';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fp from 'fastify-plugin';

interface CloudflareR2PluginOptions {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

const cloudflareR2Plugin: FastifyPluginAsync<CloudflareR2PluginOptions> = async (fastify, options) => {
  const { accountId, accessKeyId, secretAccessKey, bucketName } = options;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error('Credenciais do Cloudflare R2 são necessárias');
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  fastify.decorate('r2', {
    client: s3Client,
    bucketName,

    async uploadFile(key: string, body: Buffer, contentType: string) {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      });

      return s3Client.send(command);
    },

    async getSignedUrl(key: string, expiresIn = 3600) {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      return getSignedUrl(s3Client, command, { expiresIn });
    },

    async deleteFile(key: string) {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      return s3Client.send(command);
    },
  });
};

export default fp(cloudflareR2Plugin, {
  name: 'cloudflare-r2-plugin'
});