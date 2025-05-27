import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";
import { User } from "./User";
import { Raffle } from "./Raffle";

@Entity()
export class Ticket {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  user!: User;

  @ManyToOne()
  raffle!: Raffle;

  @Property()
  createdAt: Date = new Date();

  constructor(user: User, raffle: Raffle) {
    this.user = user;
    this.raffle = raffle;
  }
}
