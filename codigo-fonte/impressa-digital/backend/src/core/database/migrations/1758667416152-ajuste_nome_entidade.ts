import { MigrationInterface, QueryRunner } from "typeorm";

export class AjusteNomeEntidade1758667416152 implements MigrationInterface {
    name = 'AjusteNomeEntidade1758667416152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`status_produtos\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("produtos");
        if (table?.findColumnByName("status_produtos")) {
            await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`status_produtos\``);
        }
    }
}
