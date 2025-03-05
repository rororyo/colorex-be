import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSubscription1741100506976 implements MigrationInterface {
    name = 'AddedSubscription1741100506976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subscription_status_enum" AS ENUM('pending', 'active', 'expired', 'failed')`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderId" character varying NOT NULL, "amount" integer NOT NULL, "status" "public"."subscription_status_enum" NOT NULL DEFAULT 'pending', "startDate" TIMESTAMP NOT NULL DEFAULT NOW(), "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TYPE "public"."subscription_status_enum"`);
    }

}
