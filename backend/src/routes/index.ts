import { FastifyInstance } from "fastify";
import { MikroORM } from "@mikro-orm/core";
import raffleRoutes from "./raffles";
import telegramAuthRoutes from "./telegram-auth";

export default async function routes(app: FastifyInstance, orm: MikroORM) {
  await raffleRoutes(app, orm);
  await telegramAuthRoutes(app, orm);
}
