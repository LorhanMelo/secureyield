import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { MongoClient, Db } from 'mongodb';

export interface MongoDBPluginOptions {
  uri: string;
  dbName?: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: Db;
    };
  }
}

const mongodbPlugin: FastifyPluginAsync<MongoDBPluginOptions> = async (
    fastify,
    options
) => {
  const uri = options.uri;
  const dbName = options.dbName || 'secureyield';

  if (!uri) {
    throw new Error('MongoDB URI is required');
  }

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);

  fastify.decorate('mongo', {
    client: client,
    db: db
  });

  fastify.addHook('onClose', async (instance) => {
    await instance.mongo.client.close();
  });
};

export default fp(mongodbPlugin, {
  name: 'mongodb-plugin'
});