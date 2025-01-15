import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLikeTables1736954177940 implements MigrationInterface {
    name = 'AddLikeTables1736954177940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reply_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "replyId" uuid, CONSTRAINT "PK_231bdb26bda7034e75552daff73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "commentId" uuid, CONSTRAINT "PK_04f93e6f1ace5dbc1d8c562ccbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "postId" uuid, CONSTRAINT "PK_0e95caa8a8b56d7797569cf5dc6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reply_like" ADD CONSTRAINT "FK_5dca5026905fe63fa7b24a3c353" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reply_like" ADD CONSTRAINT "FK_1d39629a1cb60026550bf2d4eb2" FOREIGN KEY ("replyId") REFERENCES "reply"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_like" ADD CONSTRAINT "FK_b5a2fc7a9a2b6bcc8c74f6fbb8b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_like" ADD CONSTRAINT "FK_a253dba95eab8659c027bbace44" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_like" ADD CONSTRAINT "FK_909fc474ef645901d01f0cc0662" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_like" ADD CONSTRAINT "FK_789b3f929eb3d8760419f87c8a9" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_like" DROP CONSTRAINT "FK_789b3f929eb3d8760419f87c8a9"`);
        await queryRunner.query(`ALTER TABLE "post_like" DROP CONSTRAINT "FK_909fc474ef645901d01f0cc0662"`);
        await queryRunner.query(`ALTER TABLE "comment_like" DROP CONSTRAINT "FK_a253dba95eab8659c027bbace44"`);
        await queryRunner.query(`ALTER TABLE "comment_like" DROP CONSTRAINT "FK_b5a2fc7a9a2b6bcc8c74f6fbb8b"`);
        await queryRunner.query(`ALTER TABLE "reply_like" DROP CONSTRAINT "FK_1d39629a1cb60026550bf2d4eb2"`);
        await queryRunner.query(`ALTER TABLE "reply_like" DROP CONSTRAINT "FK_5dca5026905fe63fa7b24a3c353"`);
        await queryRunner.query(`DROP TABLE "post_like"`);
        await queryRunner.query(`DROP TABLE "comment_like"`);
        await queryRunner.query(`DROP TABLE "reply_like"`);
    }

}
