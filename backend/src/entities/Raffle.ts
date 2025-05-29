import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from "@mikro-orm/core";
import { RaffleEntry } from "./RaffleEntry";

@Entity()
export class Raffle {
  @PrimaryKey()
  id!: number;

  @Property()
  prizeDescription!: string;

  @Property()
  endsAt!: Date;

  @Property({ default: false })
  isFinished: boolean = false;

  @OneToMany(() => RaffleEntry, (entry) => entry.raffle)
  entries = new Collection<RaffleEntry>(this);
}
