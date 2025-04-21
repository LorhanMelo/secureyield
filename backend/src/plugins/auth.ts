import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { config } from '../config/config';
import fastifyJwt from '@fastify/jwt';

const authPlugin: FastifyPluginAsync = async (fastify) => {
  // Registra o plugin JWT
  fastify.register(fastifyJwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
    },
  });

  // Adiciona decorador para verificar autenticação
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Não autorizado' });
    }
  });
};

export default fp(authPlugin, {
  name: 'auth-plugin',
});