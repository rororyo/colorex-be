import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedfollowingfollwerCountCol1737279078107 implements MigrationInterface {
    name = 'AddedfollowingfollwerCountCol1737279078107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" ADD "following_count" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "follow" ADD "follower_count" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP COLUMN "follower_count"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP COLUMN "following_count"`);
    }

}
