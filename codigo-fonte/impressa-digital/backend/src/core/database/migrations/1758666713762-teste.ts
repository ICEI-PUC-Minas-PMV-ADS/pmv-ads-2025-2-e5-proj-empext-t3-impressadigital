import { MigrationInterface, QueryRunner } from "typeorm";

export class Teste1758666713762 implements MigrationInterface {
    name = 'Teste1758666713762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`status_produtos\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`status_produtos\` varchar(255) NOT NULL`);
    }

}
