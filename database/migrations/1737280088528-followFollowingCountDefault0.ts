import { MigrationInterface, QueryRunner } from "typeorm";

export class FollowFollowingCountDefault01737280088528 implements MigrationInterface {
    name = 'FollowFollowingCountDefault01737280088528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" ALTER COLUMN "following_count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "follow" ALTER COLUMN "follower_count" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" ALTER COLUMN "follower_count" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "follow" ALTER COLUMN "following_count" DROP DEFAULT`);
    }

}
