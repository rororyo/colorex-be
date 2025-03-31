import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColorTypeColumn1740296449198 implements MigrationInterface {
    name = 'AddColorTypeColumn1740296449198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_colortype_enum" AS ENUM('spring', 'summer', 'autumn', 'winter', 'notAvailable')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "colorType" "public"."user_colortype_enum" NOT NULL DEFAULT 'notAvailable'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "colorType"`);
        await queryRunner.query(`DROP TYPE "public"."user_colortype_enum"`);
    }

}
