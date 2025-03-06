import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifySubscriptionEntity1741188396032 implements MigrationInterface {
    name = 'ModifySubscriptionEntity1741188396032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "UQ_cc906b4bc892b048f1b654d2aa0" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "UQ_cc906b4bc892b048f1b654d2aa0"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "userId"`);
    }

}
