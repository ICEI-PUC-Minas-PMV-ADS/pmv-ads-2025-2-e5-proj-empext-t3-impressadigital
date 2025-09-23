import { MigrationInterface, QueryRunner } from "typeorm";

export class AjusteNomeEntida_1758667374530 implements MigrationInterface {
    name = 'AjusteNomeEntida_1758667374530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`status_produtos\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN IF EXISTS \`status_produtos\``);
    }
}
