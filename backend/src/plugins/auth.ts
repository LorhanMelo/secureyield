import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { FastifyJWT } from 'fastify-jwt';
import fp from 'fastify-plugin';
import { config } from '../config/config';

export default fp(async function (
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: (err?: Error) => void
) {
  // Registra o plugin JWT
  fastify.register(require('fastify-jwt'), {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn
    }
  });

  // Adiciona decorador para verificar autenticação
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Não autorizado' });
    }
  });

  done();
});

// Declaração de tipos para TypeScript
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>;
  }
}

declare module 'fastify-jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      role: string;
    };
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
}
