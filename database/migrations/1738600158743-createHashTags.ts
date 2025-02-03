import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHashTags1738600158743 implements MigrationInterface {
    name = 'CreateHashTags1738600158743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hash_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_a62d659726a7c3c5fb6757bb347" UNIQUE ("name"), CONSTRAINT "PK_a6640a31d78e11097a949656191" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_hash_tags_hash_tag" ("postId" uuid NOT NULL, "hashTagId" uuid NOT NULL, CONSTRAINT "PK_dd08726fc07fa0d4940c156b2d0" PRIMARY KEY ("postId", "hashTagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_69c84a655f28ffcfda64855f15" ON "post_hash_tags_hash_tag" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_462394f5865cc4e358ccf79af0" ON "post_hash_tags_hash_tag" ("hashTagId") `);
        await queryRunner.query(`ALTER TABLE "follow" DROP COLUMN "following_count"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP COLUMN "follower_count"`);
        await queryRunner.query(`ALTER TABLE "post_hash_tags_hash_tag" ADD CONSTRAINT "FK_69c84a655f28ffcfda64855f15a" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_hash_tags_hash_tag" ADD CONSTRAINT "FK_462394f5865cc4e358ccf79af09" FOREIGN KEY ("hashTagId") REFERENCES "hash_tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_hash_tags_hash_tag" DROP CONSTRAINT "FK_462394f5865cc4e358ccf79af09"`);
        await queryRunner.query(`ALTER TABLE "post_hash_tags_hash_tag" DROP CONSTRAINT "FK_69c84a655f28ffcfda64855f15a"`);
        await queryRunner.query(`ALTER TABLE "follow" ADD "follower_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "follow" ADD "following_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_462394f5865cc4e358ccf79af0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_69c84a655f28ffcfda64855f15"`);
        await queryRunner.query(`DROP TABLE "post_hash_tags_hash_tag"`);
        await queryRunner.query(`DROP TABLE "hash_tag"`);
    }

}
