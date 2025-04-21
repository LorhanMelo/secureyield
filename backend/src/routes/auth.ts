import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Collection } from 'mongodb';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export default async function (fastify: FastifyInstance) {
  const users: Collection = fastify.mongo.db.collection('users');

  // Registrar novo usuário
  fastify.post<{ Body: RegisterRequest }>(
    '/register',
    async (request, reply) => {
      const { email, password, name } = request.body;

      try {
        // Verificar se o email já existe
        const existingUser = await users.findOne({ email });
        if (existingUser) {
          return reply.status(400).send({ error: 'Email já cadastrado' });
        }

        // Criptografar a senha
        const bcrypt = require('bcrypt');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criar novo usuário
        const result = await users.insertOne({
          email,
          password: hashedPassword,
          name,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Gerar token JWT
        const token = fastify.jwt.sign({
          id: result.insertedId.toString(),
          email,
          role: 'user'
        });

        return reply.status(201).send({
          user: {
            id: result.insertedId,
            email,
            name,
            role: 'user'
          },
          token
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Erro ao registrar usuário' });
      }
    }
  );

  // Login de usuário
  fastify.post<{ Body: LoginRequest }>(
    '/login',
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        // Buscar usuário pelo email
        const user = await users.findOne({ email });
        if (!user) {
          return reply.status(401).send({ error: 'Credenciais inválidas' });
        }

        // Verificar senha
        const bcrypt = require('bcrypt');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return reply.status(401).send({ error: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        const token = fastify.jwt.sign({
          id: user._id.toString(),
          email: user.email,
          role: user.role
        });

        return reply.send({
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          token
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Erro ao fazer login' });
      }
    }
  );

  // Verificar token JWT
  fastify.get(
    '/me',
    { preHandler: fastify.authenticate },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request as any).user.id;
        const user = await users.findOne({ _id: new fastify.mongo.client.ObjectId(userId) });

        if (!user) {
          return reply.status(404).send({ error: 'Usuário não encontrado' });
        }

        return reply.send({
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Erro ao buscar usuário' });
      }
    }
  );
}
