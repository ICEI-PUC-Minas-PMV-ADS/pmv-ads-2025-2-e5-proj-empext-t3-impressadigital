import { MigrationInterface, QueryRunner } from "typeorm";

export class Criaçãotabelaavaliacoes1758750739240 implements MigrationInterface {
    name = 'Criaçãotabelaavaliacoes1758750739240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Avaliacoes_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`avaliacoes\` text NOT NULL, \`produto_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Avaliacoes_produtos\` ADD CONSTRAINT \`FK_d823c7dd774a8574845a94cc085\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Avaliacoes_produtos\` ADD CONSTRAINT \`FK_da504a316401ad680b3102687f5\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Avaliacoes_produtos\` DROP FOREIGN KEY \`FK_da504a316401ad680b3102687f5\``);
        await queryRunner.query(`ALTER TABLE \`Avaliacoes_produtos\` DROP FOREIGN KEY \`FK_d823c7dd774a8574845a94cc085\``);
        await queryRunner.query(`DROP TABLE \`Avaliacoes_produtos\``);
    }

}
