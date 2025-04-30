import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { config } from './config/config';
import mongodbPlugin, {MongoDBPluginOptions} from './plugins/mongodb';
import jwt from '@fastify/jwt';
import formBody from '@fastify/formbody';


const app: FastifyInstance = fastify({
  logger: true,
  bodyLimit: 1048576,
});

// Registra plugins
app.register(formBody); //
app.register(jwt, {
  secret: 'Ad09062003@12'
});
app.register(mongodbPlugin, {
  uri: config.mongodb.uri,
  dbName: config.mongodb.dbName,
} as MongoDBPluginOptions);

const registerRoutes = async () => {
  app.register(import('./routes/auth'), { prefix: '/api/auth' });
  app.register(import('./routes/users'), { prefix: '/api/users' });
  app.register(import('./routes/automation'), { prefix: '/api/automation' });
};

const initialize = async () => {
  try {
    await registerRoutes();

    app.addHook('onRequest', (request, reply, done) => {
      reply.header('Content-Type', 'application/json');
      reply.header('Access-Control-Allow-Origin', config.corsOrigin);
      reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin'); // <-- Adicionado Origin
      reply.header('Access-Control-Allow-Credentials', 'true');

      if (request.method === 'OPTIONS') {
        reply.status(204).send();
        return;
      }

      done();
    });

    app.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    app.setErrorHandler((error, request, reply) => {
      app.log.error(error);
      reply
          .status(error.statusCode || 500)
          .send({
            error: error.message || 'Erro interno do servidor',
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
          });
    });

    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

export { app, initialize };