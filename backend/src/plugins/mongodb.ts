import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { MongoClient } from 'mongodb';

interface MongoDBPluginOptions {
  uri: string;
  dbName?: string;
}

export default fp(async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions & MongoDBPluginOptions,
  done: (err?: Error) => void
) {
  const uri = options.uri;
  const dbName = options.dbName || 'secureyield';

  if (!uri) {
    return done(new Error('MongoDB URI is required'));
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db(dbName);
    
    // Adiciona o cliente e o db ao contexto do Fastify
    fastify.decorate('mongo', { client, db });
    
    // Fecha a conexão quando o servidor é encerrado
    fastify.addHook('onClose', (instance, done) => {
      if (client) {
        instance.mongo.client.close()
          .then(() => done())
          .catch(done);
      } else {
        done();
      }
    });
    
    done();
  } catch (err) {
    done(err as Error);
  }
});

// Declaração de tipos para TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: ReturnType<MongoClient['db']>;
    };
  }
}
