"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = raffleRoutes;
const Raffle_1 = require("../entities/Raffle");
function raffleRoutes(app, orm) {
    return __awaiter(this, void 0, void 0, function* () {
        const em = orm.em.fork();
        app.get("/raffles", (req, reply) => __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const raffles = yield em.find(Raffle_1.Raffle, {
                endsAt: { $gt: now },
            }, { populate: ["tickets"] });
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
        }));
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
    });
}
