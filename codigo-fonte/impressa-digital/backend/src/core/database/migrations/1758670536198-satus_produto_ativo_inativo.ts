import { MigrationInterface, QueryRunner } from "typeorm";

export class SatusProdutoAtivoInativo1758670536198 implements MigrationInterface {
    name = 'SatusProdutoAtivoInativo1758670536198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`status_produto\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`status_produto\``);
    }

}
