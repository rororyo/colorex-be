import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAvatarUrlColumn1738747621451 implements MigrationInterface {
    name = 'UserAvatarUrlColumn1738747621451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarUrl" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."post_post_type_enum" RENAME TO "post_post_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."post_post_type_enum" AS ENUM('text', 'image', 'video')`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "post_type" TYPE "public"."post_post_type_enum" USING "post_type"::"text"::"public"."post_post_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."post_post_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "media_url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "media_url" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."post_post_type_enum_old" AS ENUM('image', 'video')`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "post_type" TYPE "public"."post_post_type_enum_old" USING "post_type"::"text"::"public"."post_post_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."post_post_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."post_post_type_enum_old" RENAME TO "post_post_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarUrl"`);
    }

}
