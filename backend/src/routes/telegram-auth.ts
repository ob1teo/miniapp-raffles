import { FastifyInstance } from "fastify";
import { MikroORM } from "@mikro-orm/core";
import crypto from "crypto";
import { User } from "../entities/User";

interface ITelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
  [key: string]: any;
}

function checkTelegramAuth(
  data: Record<string, any>,
  botToken: string,
): boolean {
  const { hash, auth_date, ...authData } = data;

  if (Date.now() / 1000 - Number(auth_date) > 86400) {
    return false;
  }

  const sortedKeys = Object.keys(authData).sort();
  const checkString = sortedKeys.map((k) => `${k}=${authData[k]}`).join("\n");

  const secret = crypto.createHash("sha256").update(botToken).digest();
  const hmac = crypto.createHmac("sha256", secret).update(checkString).digest();

  const hashBuffer = Buffer.from(hash, "hex");
  if (hashBuffer.length !== hmac.length) return false;

  return crypto.timingSafeEqual(hmac, hashBuffer);
}

export default async function telegramAuthRoutes(
  app: FastifyInstance,
  orm: MikroORM,
) {
  app.post<{ Body: ITelegramAuthData }>(
    "/telegram/auth",
    async (req, reply) => {
      const data = req.body;

      const em = orm.em.fork();

      if (!checkTelegramAuth(data, process.env.BOT_API_TOKEN!)) {
        return reply.status(403).send({ error: "Invalid authorization data" });
      }

      let user = await em.findOne(User, { telegramId: data.id });

      if (!user) {
        user = em.create(User, {
          telegramId: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          username: data.username,
          photoUrl: data.photo_url,
          ticketBalance: 0,
          createdAt: new Date(),
        });

        await em.persistAndFlush(user);
      } else {
        user.firstName = data.first_name;
        user.lastName = data.last_name;
        user.username = data.username;
        user.photoUrl = data.photo_url;
        await em.flush();
      }

      return {
        id: user.id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
      };
    },
  );
}
