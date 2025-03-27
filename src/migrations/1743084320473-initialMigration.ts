import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1743084320473 implements MigrationInterface {
    name = 'InitialMigration1743084320473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "when" TIMESTAMP NOT NULL, "address" character varying NOT NULL, "organizerId" uuid, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."attendee_answer_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "attendee" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "eventId" integer NOT NULL, "answer" "public"."attendee_answer_enum" NOT NULL DEFAULT '1', "userId" uuid NOT NULL, CONSTRAINT "PK_070338c19378315cb793abac656" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_19642e6a244b4885e14eab0fdc0" FOREIGN KEY ("organizerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendee" ADD CONSTRAINT "FK_7d85e02cada107c99eb697dd1fe" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendee" ADD CONSTRAINT "FK_a53717c5719b2eb8910e32a0853" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendee" DROP CONSTRAINT "FK_a53717c5719b2eb8910e32a0853"`);
        await queryRunner.query(`ALTER TABLE "attendee" DROP CONSTRAINT "FK_7d85e02cada107c99eb697dd1fe"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_19642e6a244b4885e14eab0fdc0"`);
        await queryRunner.query(`DROP TABLE "attendee"`);
        await queryRunner.query(`DROP TYPE "public"."attendee_answer_enum"`);
        await queryRunner.query(`DROP TABLE "event"`);
    }

}
