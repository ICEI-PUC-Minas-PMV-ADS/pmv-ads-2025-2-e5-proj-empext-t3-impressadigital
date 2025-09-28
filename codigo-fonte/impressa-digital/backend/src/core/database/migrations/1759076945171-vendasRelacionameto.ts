import { MigrationInterface, QueryRunner } from "typeorm";

export class VendasRelacionameto1759076945171 implements MigrationInterface {
    name = 'VendasRelacionameto1759076945171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vendas\` ADD \`produtos_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`slug\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD UNIQUE INDEX \`IDX_64fbbaea303f9816067b6a4e09\` (\`slug\`)`);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`vendas_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vendas\` ADD CONSTRAINT \`FK_073b6a41cdc9d75b6fb801de1d3\` FOREIGN KEY (\`produtos_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD CONSTRAINT \`FK_1e8e41dc20ef1a0a142c1da15b2\` FOREIGN KEY (\`vendas_id\`) REFERENCES \`vendas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP FOREIGN KEY \`FK_1e8e41dc20ef1a0a142c1da15b2\``);
        await queryRunner.query(`ALTER TABLE \`vendas\` DROP FOREIGN KEY \`FK_073b6a41cdc9d75b6fb801de1d3\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`vendas_id\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP INDEX \`IDX_64fbbaea303f9816067b6a4e09\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`slug\``);
        await queryRunner.query(`ALTER TABLE \`vendas\` DROP COLUMN \`produtos_id\``);
    }

}
