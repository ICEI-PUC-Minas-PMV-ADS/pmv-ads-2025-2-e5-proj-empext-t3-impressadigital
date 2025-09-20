import { MigrationInterface, QueryRunner } from "typeorm";

export class AjusteDeSemestoque1758392296443 implements MigrationInterface {
    name = 'AjusteDeSemestoque1758392296443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`estoque\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`estoque\``);
    }

}
