import { Migration } from '@mikro-orm/migrations';

export class Migration20250527011729 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "ticket" drop constraint "ticket_raffle_id_foreign";`);

    this.addSql(`alter table "raffle" add column "prize" varchar(255) not null, add column "is_finished" boolean not null default false;`);
    this.addSql(`alter table "raffle" alter column "id" type int using ("id"::int);`);
    this.addSql(`create sequence if not exists "raffle_id_seq";`);
    this.addSql(`select setval('raffle_id_seq', (select max("id") from "raffle"));`);
    this.addSql(`alter table "raffle" alter column "id" set default nextval('raffle_id_seq');`);

    this.addSql(`alter table "user" drop column "attempts_left";`);

    this.addSql(`alter table "user" add column "username" varchar(255) not null, add column "ticket_balance" int not null default 0;`);

    this.addSql(`alter table "ticket" drop column "count";`);

    this.addSql(`alter table "ticket" add column "created_at" timestamptz not null;`);
    this.addSql(`alter table "ticket" alter column "raffle_id" type int using ("raffle_id"::int);`);
    this.addSql(`alter table "ticket" add constraint "ticket_raffle_id_foreign" foreign key ("raffle_id") references "raffle" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "ticket" drop constraint "ticket_raffle_id_foreign";`);

    this.addSql(`alter table "raffle" drop column "prize", drop column "is_finished";`);

    this.addSql(`alter table "raffle" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "raffle" alter column "id" drop default;`);

    this.addSql(`alter table "user" drop column "username", drop column "ticket_balance";`);

    this.addSql(`alter table "user" add column "attempts_left" int not null default 5;`);

    this.addSql(`alter table "ticket" drop column "created_at";`);

    this.addSql(`alter table "ticket" add column "count" int not null default 1;`);
    this.addSql(`alter table "ticket" alter column "raffle_id" type varchar(255) using ("raffle_id"::varchar(255));`);
    this.addSql(`alter table "ticket" add constraint "ticket_raffle_id_foreign" foreign key ("raffle_id") references "raffle" ("id") on update cascade;`);
  }

}
