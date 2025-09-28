import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlugToProdutos1696000000000 implements MigrationInterface {
    name = 'AddSlugToProdutos1696000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`produtos\`
            ADD \`slug\` varchar(255) NOT NULL UNIQUE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`produtos\` DROP COLUMN \`slug\`
        `);
    }
}
