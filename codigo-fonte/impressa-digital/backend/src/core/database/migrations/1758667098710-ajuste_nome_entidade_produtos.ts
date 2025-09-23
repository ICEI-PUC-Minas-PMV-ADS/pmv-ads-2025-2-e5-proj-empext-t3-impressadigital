import { MigrationInterface, QueryRunner } from "typeorm";

export class AjusteNomeEntidadeProdutos1758667098710 implements MigrationInterface {
    name = 'AjusteNomeEntidadeProdutos1758667098710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`status_produtos\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`status_produtos\` varchar(255) NOT NULL`);
    }

}
