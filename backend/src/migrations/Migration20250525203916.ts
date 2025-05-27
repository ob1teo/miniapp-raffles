import { Migration } from '@mikro-orm/migrations';

export class Migration20250525203916 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "raffle" ("id" varchar(255) not null, "title" varchar(255) not null, "image_url" varchar(255) not null, "ends_at" timestamptz not null, constraint "raffle_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" varchar(255) not null, "attempts_left" int not null default 5, constraint "user_pkey" primary key ("id"));`);

    this.addSql(`create table "ticket" ("id" serial primary key, "user_id" varchar(255) not null, "raffle_id" varchar(255) not null, "count" int not null default 1);`);

    this.addSql(`alter table "ticket" add constraint "ticket_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "ticket" add constraint "ticket_raffle_id_foreign" foreign key ("raffle_id") references "raffle" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "ticket" drop constraint "ticket_raffle_id_foreign";`);

    this.addSql(`alter table "ticket" drop constraint "ticket_user_id_foreign";`);

    this.addSql(`drop table if exists "raffle" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "ticket" cascade;`);
  }

}
