import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFCMTokenColumn1739434871240 implements MigrationInterface {
    name = 'CreateFCMTokenColumn1739434871240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fcmToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fcmToken"`);
    }

}
