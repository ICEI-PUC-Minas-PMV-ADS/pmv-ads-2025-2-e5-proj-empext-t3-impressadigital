import { MigrationInterface, QueryRunner } from "typeorm";

export class AjusteDeSemestoque1758392389737 implements MigrationInterface {
    name = 'AjusteDeSemestoque1758392389737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`estoque\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`estoque\` int NOT NULL DEFAULT '0'`);
    }

}
