import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AjusteNomeEntidadeProdutosstatus1758667225761 implements MigrationInterface {
    name = 'AjusteNomeEntidadeProdutosstatus1758667225761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`status_produtos\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Checa se a coluna existe antes de remover
        const table = await queryRunner.getTable("produtos");
        if (table?.findColumnByName("status_produtos")) {
            await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`status_produtos\``);
        }
    }
}
