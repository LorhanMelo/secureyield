import { FastifyInstance } from 'fastify';
import { Collection } from 'mongodb';
import { ObjectId } from 'mongodb';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

interface AutomationRequest {
  userId: string;
  parameters?: Record<string, any>;
}

interface AutomationLog {
  userId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function (fastify: FastifyInstance) {
  const automationLogs: Collection = fastify.mongo.db.collection('automationLogs');

  // Iniciar automação
  fastify.post<{ Body: AutomationRequest }>(
    '/start',
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { parameters } = request.body;
      const user = (request as any).user;

      try {
        // Criar registro de log da automação
        const automationLog: AutomationLog = {
          userId: user.id,
          status: 'pending',
          startTime: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await automationLogs.insertOne(automationLog);
        const automationId = result.insertedId.toString();

        // Atualizar status para 'running'
        await automationLogs.updateOne(
          { _id: result.insertedId },
          { $set: { status: 'running', updatedAt: new Date() } }
        );

        // Iniciar processo de automação em background
        fastify.log.info(`Iniciando automação para usuário ${user.id}`);
        
        // Aqui você executaria o script Playwright
        // Esta é uma implementação simulada para o exemplo
        setTimeout(async () => {
          try {
            // Simulação de execução bem-sucedida
            await automationLogs.updateOne(
              { _id: result.insertedId },
              { 
                $set: { 
                  status: 'completed', 
                  endTime: new Date(),
                  result: { success: true, message: 'Automação concluída com sucesso' },
                  updatedAt: new Date() 
                } 
              }
            );
            fastify.log.info(`Automação ${automationId} concluída com sucesso`);
          } catch (error: any) {
            await automationLogs.updateOne(
              { _id: result.insertedId },
              { 
                $set: { 
                  status: 'failed', 
                  endTime: new Date(),
                  error: error.message || 'Erro desconhecido',
                  updatedAt: new Date() 
                } 
              }
            );
            fastify.log.error(`Erro na automação ${automationId}: ${error.message}`);
          }
        }, 5000);

        return reply.status(202).send({ 
          success: true, 
          message: 'Automação iniciada com sucesso', 
          automationId 
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Erro ao iniciar automação' });
      }
    }
  );

  // Obter status da automação
  fastify.get(
    '/status/:id',
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const user = (request as any).user;

      try {
        const automationLog = await automationLogs.findOne({
          _id: new ObjectId(id)
        });

        if (!automationLog) {
          return reply.status(404).send({ error: 'Automação não encontrada' });
        }

        // Verificar se o usuário tem permissão para acessar esta automação
        if (automationLog.userId !== user.id && user.role !== 'admin') {
          return reply.status(403).send({ error: 'Acesso negado' });
        }

        return reply.send({ automation: automationLog });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Erro ao buscar status da automação' });
      }
    }
  );

  // Obter histórico de automações do usuário
  fastify.get(
    '/history',
    { preHandler: fastify.authenticate },
    async (request, reply) => {
      const user = (request as any).user;

      try {
        const history = await automationLogs.find({
          userId: user.id
        }).sort({ startTime: -1 }).toArray();

        return reply.send({ history });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Erro ao buscar histórico de automações' });
      }
    }
  );

  // Executar automação real com Playwright (implementação futura)
  async function runPlaywrightAutomation(userId: string, parameters: any) {
    // Esta função seria implementada para executar o script Playwright
    // com os parâmetros fornecidos pelo usuário
    return { success: true, message: 'Automação concluída com sucesso' };
  }
}
