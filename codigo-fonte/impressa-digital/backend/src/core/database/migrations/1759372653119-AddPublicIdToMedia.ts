import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublicIdToMedia1759372653119 implements MigrationInterface {
    name = 'AddPublicIdToMedia1759372653119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`midias\`
            ADD COLUMN \`public_id\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`midias\`
            DROP COLUMN \`public_id\`
        `);
    }
}
