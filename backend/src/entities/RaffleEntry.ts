import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { Raffle } from "./Raffle";
import { User } from "./User";

@Entity()
export class RaffleEntry {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Raffle)
  raffle!: Raffle;

  @Property()
  ticketsCount!: number;
}
