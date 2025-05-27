import { FastifyInstance } from "fastify";
import { MikroORM } from "@mikro-orm/core";
import { Raffle } from "../entities/Raffle";
import { User } from "../entities/User";
import { Ticket } from "../entities/Ticket";

interface RaffleParams {
  id: string;
}

interface JoinBody {
  ticketCount: number;
  userId: string;
}

export default async function raffleRoutes(
  app: FastifyInstance,
  orm: MikroORM,
) {
  const em = orm.em.fork();

  app.get("/raffles", async (req, reply) => {
    const now = new Date();

    const raffles = await em.find(
      Raffle,
      {
        endsAt: { $gt: now },
      },
      { populate: ["tickets"] },
    );

    const result = raffles.map((raffle) => ({
      id: raffle.id,
      title: raffle.title,
      imageUrl: raffle.imageUrl,
      endsAt: raffle.endsAt.toISOString(),
      prize: raffle.prize,
      totalTickets: raffle.tickets.length,
      participantCount: new Set(raffle.tickets.map((t) => t.user.id)).size,
    }));

    return result;
  });

  //   app.post<{
  //     Params: RaffleParams;
  //     Body: JoinBody;
  //   }>("/raffles/:id/join", async (req, reply) => {
  //     const { ticketCount, userId } = req.body;
  //     const raffleId = Number(req.params.id);
  //     const em = orm.em.fork();
  //
  //     const user = await em.findOne(User, { id: userId });
  //     const raffle = await em.findOne(Raffle, { id: raffleId });
  //
  //     if (!user || !raffle)
  //       return reply.status(404).send({ error: "User or raffle not found" });
  //
  //     if (user.ticketBalance < ticketCount) {
  //       return reply.status(400).send({ error: "Недостаточно билетов" });
  //     }
  //
  //     for (let i = 0; i < ticketCount; i++) {
  //       em.persist(new Ticket(user, raffle));
  //     }
  //
  //     user.ticketBalance -= ticketCount;
  //     await em.flush();
  //
  //     return { success: true };
  //   });
}
