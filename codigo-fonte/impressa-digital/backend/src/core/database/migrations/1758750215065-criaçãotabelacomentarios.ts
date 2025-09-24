import { MigrationInterface, QueryRunner } from "typeorm";

export class Criaçãotabelacomentarios1758750215065 implements MigrationInterface {
    name = 'Criaçãotabelacomentarios1758750215065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comentario_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`comentario\` text NOT NULL, \`produto_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`status\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comentario_produtos\` ADD CONSTRAINT \`FK_d0c75f24df45e8ed7f2be343e1a\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comentario_produtos\` ADD CONSTRAINT \`FK_e88433ca204dd79db4a94675035\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comentario_produtos\` DROP FOREIGN KEY \`FK_e88433ca204dd79db4a94675035\``);
        await queryRunner.query(`ALTER TABLE \`comentario_produtos\` DROP FOREIGN KEY \`FK_d0c75f24df45e8ed7f2be343e1a\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`status\``);
        await queryRunner.query(`DROP TABLE \`comentario_produtos\``);
    }

}
