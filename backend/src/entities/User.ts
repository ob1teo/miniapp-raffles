import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  telegramId!: number;

  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;

  @Property({ nullable: true })
  username?: string;

  @Property({ nullable: true })
  photoUrl?: string;

  @Property({ default: 0 })
  ticketBalance: number = 0;

  @Property()
  createdAt = new Date();
}
