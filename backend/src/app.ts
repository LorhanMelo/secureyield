import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { config } from './config/config';
import mongodbPlugin, {MongoDBPluginOptions} from './plugins/mongodb';
import jwt from '@fastify/jwt';

// Cria a instância do Fastify
const app: FastifyInstance = fastify({
  logger: true
});

app.register(jwt, {
  secret: 'your_jwt_secret_key_here'
});

// Registra plugins
app.register(mongodbPlugin, {
  uri: config.mongodb.uri,
  dbName: config.mongodb.dbName,
} as MongoDBPluginOptions);

// Registra rotas
const registerRoutes = async () => {
  // Registra rotas de autenticação
  app.register(import('./routes/auth'), { prefix: '/api/auth' });
  
  // Registra rotas de usuários
  app.register(import('./routes/users'), { prefix: '/api/users' });
  
  // Registra rotas de automação
  app.register(import('./routes/automation'), { prefix: '/api/automation' });
};

// Inicializa o aplicativo
const initialize = async () => {
  try {
    // Registra rotas
    await registerRoutes();
    
    // Adiciona hook para CORS
    app.addHook('onRequest', (request, reply, done) => {
      reply.header('Access-Control-Allow-Origin', config.corsOrigin);
      reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      reply.header('Access-Control-Allow-Credentials', 'true');
      
      if (request.method === 'OPTIONS') {
        reply.status(204).send();
        return;
      }
      
      done();
    });
    
    // Adiciona rota de verificação de saúde
    app.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });
    
    return app;
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

export { app, initialize };
