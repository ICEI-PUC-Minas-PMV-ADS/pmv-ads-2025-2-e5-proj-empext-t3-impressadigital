import { MigrationInterface, QueryRunner } from "typeorm";

export class Criacaodeavaliacaoes1758994898780 implements MigrationInterface {
    name = 'Criacaodeavaliacaoes1758994898780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`slug\` ON \`produtos\``);
        await queryRunner.query(`CREATE TABLE \`avaliacoes_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`avaliacoes\` text NOT NULL, \`rating\` enum ('1', '2', '3', '4', '5') NOT NULL DEFAULT '5', \`produto_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`slug\``);
        await queryRunner.query(`ALTER TABLE \`midias\` ADD \`avaliacao_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`midias\` DROP FOREIGN KEY \`FK_4cfcdf96bd83d43da671491a6b4\``);
        await queryRunner.query(`ALTER TABLE \`midias\` CHANGE \`produto_id\` \`produto_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`avaliacoes_produtos\` ADD CONSTRAINT \`FK_a49738c76d06a89347965bf8406\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`avaliacoes_produtos\` ADD CONSTRAINT \`FK_a960f5c695383bd55a8426652fc\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`midias\` ADD CONSTRAINT \`FK_4cfcdf96bd83d43da671491a6b4\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`midias\` ADD CONSTRAINT \`FK_0efb8ca1ff466fe9c35c9748274\` FOREIGN KEY (\`avaliacao_id\`) REFERENCES \`avaliacoes_produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`midias\` DROP FOREIGN KEY \`FK_0efb8ca1ff466fe9c35c9748274\``);
        await queryRunner.query(`ALTER TABLE \`midias\` DROP FOREIGN KEY \`FK_4cfcdf96bd83d43da671491a6b4\``);
        await queryRunner.query(`ALTER TABLE \`avaliacoes_produtos\` DROP FOREIGN KEY \`FK_a960f5c695383bd55a8426652fc\``);
        await queryRunner.query(`ALTER TABLE \`avaliacoes_produtos\` DROP FOREIGN KEY \`FK_a49738c76d06a89347965bf8406\``);
        await queryRunner.query(`ALTER TABLE \`midias\` CHANGE \`produto_id\` \`produto_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`midias\` ADD CONSTRAINT \`FK_4cfcdf96bd83d43da671491a6b4\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`midias\` DROP COLUMN \`avaliacao_id\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`slug\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`avaliacoes_produtos\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`slug\` ON \`produtos\` (\`slug\`)`);
    }

}
