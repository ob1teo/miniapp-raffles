import { FastifyInstance } from "fastify";
import { MikroORM } from "@mikro-orm/core";
import { User } from "../entities/User";
import { Raffle } from "../entities/Raffle";
import { RaffleEntry } from "../entities/RaffleEntry";

interface JoinRaffleBody {
  raffleId: number;
  telegramId: string;
  tickets: number;
}

export default async function raffleRoutes(
  app: FastifyInstance,
  orm: MikroORM,
) {
  app.get<{ Params: { telegramId: string } }>(
    "/raffles/:telegramId",
    async (req, reply) => {
      const em = orm.em.fork();
      const { telegramId } = req.params;

      const user = await em.findOne(User, { telegramId });

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      const raffles = await em.find(Raffle, {});

      const result = await Promise.all(
        raffles.map(async (raffle) => {
          const entries = await em.find(
            RaffleEntry,
            { raffle: raffle.id },
            { populate: ["user"] },
          );

          const totalTickets = entries.reduce(
            (sum, e) => sum + e.ticketsCount,
            0,
          );

          const participants = new Set(entries.map((e) => e.user.id)).size;

          const userTickets = entries
            .filter((e) => e.user.id === user.id)
            .reduce((sum, e) => sum + e.ticketsCount, 0);

          return {
            id: raffle.id,
            title: raffle.prizeDescription,
            prizeDescription: raffle.prizeDescription,
            imageUrl: raffle.prizeDescription,
            endsAt: raffle.endsAt,
            participants: participants,
            isFinished: raffle.isFinished,
            totalTickets,
            userTickets,
          };
        }),
      );

      return result;
    },
  );

  app.post<{ Body: JoinRaffleBody }>("/raffles/join", async (req, reply) => {
    const { raffleId, telegramId, tickets } = req.body;
    const em = orm.em.fork();

    if (tickets <= 0) {
      return reply.status(400).send({ error: "tickets must be > 0" });
    }

    const user = await em.findOne(User, { telegramId });

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    if (user.ticketBalance < tickets) {
      return reply.status(400).send({ error: "Not enough ticket balance" });
    }

    const raffle = await em.findOne(Raffle, {
      id: raffleId,
      isFinished: false,
    });

    if (!raffle) {
      return reply
        .status(404)
        .send({ error: "Raffle not found or already finished" });
    }

    let entry = await em.findOne(RaffleEntry, { user, raffle });

    if (!entry) {
      entry = em.create(RaffleEntry, { user, raffle, ticketsCount: 0 });
    }

    user.ticketBalance -= tickets;
    entry.ticketsCount += tickets;

    await em.persistAndFlush([user, entry]);

    return {
      success: true,
      newTicketBalance: user.ticketBalance,
    };
  });
}
