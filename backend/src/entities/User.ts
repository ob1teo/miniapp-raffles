import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from "@mikro-orm/core";
import { RaffleEntry } from "./RaffleEntry";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  telegramId!: string;

  @Property({ nullable: true })
  username?: string;

  @Property({ default: 0 })
  ticketBalance: number = 0;

  @Property()
  createdAt = new Date();

  @OneToMany(() => RaffleEntry, (entry) => entry.user)
  raffleEntries = new Collection<RaffleEntry>(this);
}
