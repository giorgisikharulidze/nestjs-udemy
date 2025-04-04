import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1743090579899 implements MigrationInterface {
    name = 'InitialMigration1743090579899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "property_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "make" character varying, "model" character varying, "address" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" uuid NOT NULL, CONSTRAINT "UQ_016c46fd92461e2da1c9dd374a0" UNIQUE ("propertyId"), CONSTRAINT "REL_016c46fd92461e2da1c9dd374a" UNIQUE ("propertyId"), CONSTRAINT "PK_19c81adbeb8ab98294974c539a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."property_type_enum" AS ENUM('REAL_ESTATE', 'MOVABLE_ESTATE')`);
        await queryRunner.query(`CREATE TABLE "property" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "type" "public"."property_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "when" TIMESTAMP NOT NULL, "address" character varying NOT NULL, "organizerId" uuid, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."attendee_answer_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "attendee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "eventId" uuid NOT NULL, "answer" "public"."attendee_answer_enum" NOT NULL DEFAULT '1', "userId" uuid NOT NULL, CONSTRAINT "PK_070338c19378315cb793abac656" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(60) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roles" text array NOT NULL DEFAULT '{user}', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "description" text, "status" "public"."task_status_enum" NOT NULL DEFAULT 'OPEN', "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_label" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "taskId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_93a72d5d7e5370002fd7a237fd9" UNIQUE ("name", "taskId"), CONSTRAINT "PK_fb2322fb12d4db26386caeff6ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2ed786959519e4915b874d3677" ON "task_label" ("taskId") `);
        await queryRunner.query(`ALTER TABLE "property_details" ADD CONSTRAINT "FK_016c46fd92461e2da1c9dd374a0" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_d90007b39cfcf412e15823bebc1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_19642e6a244b4885e14eab0fdc0" FOREIGN KEY ("organizerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendee" ADD CONSTRAINT "FK_7d85e02cada107c99eb697dd1fe" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendee" ADD CONSTRAINT "FK_a53717c5719b2eb8910e32a0853" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_label" ADD CONSTRAINT "FK_2ed786959519e4915b874d3677b" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_label" DROP CONSTRAINT "FK_2ed786959519e4915b874d3677b"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
        await queryRunner.query(`ALTER TABLE "attendee" DROP CONSTRAINT "FK_a53717c5719b2eb8910e32a0853"`);
        await queryRunner.query(`ALTER TABLE "attendee" DROP CONSTRAINT "FK_7d85e02cada107c99eb697dd1fe"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_19642e6a244b4885e14eab0fdc0"`);
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_d90007b39cfcf412e15823bebc1"`);
        await queryRunner.query(`ALTER TABLE "property_details" DROP CONSTRAINT "FK_016c46fd92461e2da1c9dd374a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2ed786959519e4915b874d3677"`);
        await queryRunner.query(`DROP TABLE "task_label"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "attendee"`);
        await queryRunner.query(`DROP TYPE "public"."attendee_answer_enum"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "property"`);
        await queryRunner.query(`DROP TYPE "public"."property_type_enum"`);
        await queryRunner.query(`DROP TABLE "property_details"`);
    }

}
