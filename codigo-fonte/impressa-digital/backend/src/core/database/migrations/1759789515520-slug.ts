import { MigrationInterface, QueryRunner } from "typeorm";

export class Slug1759789515520 implements MigrationInterface {
    name = 'Slug1759789515520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_0efb8ca1ff466fe9c35c9748274\` ON \`midias\``);
        await queryRunner.query(`ALTER TABLE \`categorias\` ADD \`slug\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categorias\` ADD UNIQUE INDEX \`IDX_d7c32fbaefae4a73773e52c316\` (\`slug\`)`);
        await queryRunner.query(`ALTER TABLE \`midias\` ADD CONSTRAINT \`FK_0efb8ca1ff466fe9c35c9748274\` FOREIGN KEY (\`avaliacao_id\`) REFERENCES \`avaliacoes_produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`midias\` DROP FOREIGN KEY \`FK_0efb8ca1ff466fe9c35c9748274\``);
        await queryRunner.query(`ALTER TABLE \`categorias\` DROP INDEX \`IDX_d7c32fbaefae4a73773e52c316\``);
        await queryRunner.query(`ALTER TABLE \`categorias\` DROP COLUMN \`slug\``);
        await queryRunner.query(`CREATE INDEX \`FK_0efb8ca1ff466fe9c35c9748274\` ON \`midias\` (\`avaliacao_id\`)`);
    }

}
