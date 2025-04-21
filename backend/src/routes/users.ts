import { FastifyInstance } from 'fastify';
import { Collection } from 'mongodb';

interface UserUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
}

export default async function (fastify: FastifyInstance) {
  const users: Collection = fastify.mongo.db.collection('users');

  // Obter todos os usuários (apenas para admin)
  fastify.get(
    '/',
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      try {
        const user = (request as any).user;
        
        // Verificar se o usuário é admin
        if (user.role !== 'admin') {
          return reply.status(403).send({ error: 'Acesso negado' });
        }

        const usersList = await users.find({}, { projection: { password: 0 } }).toArray();
        
        return reply.send({ users: usersList });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Erro ao buscar usuários' });
      }
    }
  );

  // Obter usuário por ID
  fastify.get(
    '/:id',
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const requestUser = (request as any).user;

      try {
        // Verificar se o usuário está buscando a si mesmo ou é admin
        if (requestUser.id !== id && requestUser.role !== 'admin') {
          return reply.status(403).send({ error: 'Acesso negado' });
        }

        const user = await users.findOne(
          { _id: new fastify.mongo.client.ObjectId(id) },
          { projection: { password: 0 } }
        );

        if (!user) {
          return reply.status(404).send({ error: 'Usuário não encontrado' });
        }

        return reply.send({ user });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Erro ao buscar usuário' });
      }
    }
  );

  // Atualizar usuário
  fastify.put<{ Body: UserUpdateRequest, Params: { id: string } }>(
    '/:id',
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { id } = request.params;
      const updates = request.body;
      const requestUser = (request as any).user;

      try {
        // Verificar se o usuário está atualizando a si mesmo ou é admin
        if (requestUser.id !== id && requestUser.role !== 'admin') {
          return reply.status(403).send({ error: 'Acesso negado' });
        }

        // Preparar objeto de atualização
        const updateData: any = {
          updatedAt: new Date()
        };

        if (updates.name) updateData.name = updates.name;
        if (updates.email) updateData.email = updates.email;

        // Se houver atualização de senha, criptografá-la
        if (updates.password) {
          const bcrypt = require('bcrypt');
          const salt = await bcrypt.genSalt(10);
          updateData.password = await bcrypt.hash(updates.password, salt);
        }

        const result = await users.updateOne(
          { _id: new fastify.mongo.client.ObjectId(id) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return reply.status(404).send({ error: 'Usuário não encontrado' });
        }

        return reply.send({ success: true, message: 'Usuário atualizado com sucesso' });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Erro ao atualizar usuário' });
      }
    }
  );

  // Excluir usuário
  fastify.delete(
    '/:id',
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const requestUser = (request as any).user;

      try {
        // Verificar se o usuário está excluindo a si mesmo ou é admin
        if (requestUser.id !== id && requestUser.role !== 'admin') {
          return reply.status(403).send({ error: 'Acesso negado' });
        }

        const result = await users.deleteOne({ _id: new fastify.mongo.client.ObjectId(id) });

        if (result.deletedCount === 0) {
          return reply.status(404).send({ error: 'Usuário não encontrado' });
        }

        return reply.send({ success: true, message: 'Usuário excluído com sucesso' });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Erro ao excluir usuário' });
      }
    }
  );
}
