import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentReplyTimestamp1736933397110 implements MigrationInterface {
    name = 'AddCommentReplyTimestamp1736933397110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reply" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "reply" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP COLUMN "created_at"`);
    }

}
