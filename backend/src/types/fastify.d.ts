import { MongoClient, Db } from 'mongodb';
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        mongo: {
            client: MongoClient;
            db: Db;
        };
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}