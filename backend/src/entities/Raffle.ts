import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from "@mikro-orm/core";
import { Ticket } from "./Ticket";

@Entity()
export class Raffle {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property()
  imageUrl!: string;

  @Property()
  prize!: string;

  @Property()
  endsAt!: Date;

  @Property()
  isFinished: boolean = false;

  @OneToMany(() => Ticket, (ticket) => ticket.raffle)
  tickets = new Collection<Ticket>(this);
}
