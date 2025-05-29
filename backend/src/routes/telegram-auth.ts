import { FastifyInstance } from "fastify";
import { MikroORM } from "@mikro-orm/core";
import { User } from "../entities/User";

interface CreateUserBody {
  telegramId: string;
  username?: string;
}

export default async function telegramAuthRoutes(
  app: FastifyInstance,
  orm: MikroORM,
) {
  app.post<{ Body: CreateUserBody }>("/telegram/auth", async (req, reply) => {
    const { telegramId, username } = req.body;
    const em = orm.em.fork();

    if (!telegramId) {
      return reply.status(400).send({ error: "telegramId is required" });
    }

    let user = await em.findOne(User, { telegramId });

    if (user) {
      return { success: true, user };
    }

    user = em.create(User, {
      telegramId,
      username,
      createdAt: new Date(),
      ticketBalance: 0,
    });

    await em.persistAndFlush(user);

    return { success: true, user };
  });
}
