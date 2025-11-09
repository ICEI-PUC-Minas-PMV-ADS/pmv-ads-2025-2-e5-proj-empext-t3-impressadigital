import { MigrationInterface, QueryRunner } from "typeorm";

export class Mudancasenderecos1761344349078 implements MigrationInterface {
    name = 'Mudancasenderecos1761344349078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`carrinho\` ADD \`quantidade\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`complemento\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`is_primary\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`numero\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`numero\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`bairro\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`bairro\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`estado\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`cep\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`cep\` varchar(9) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('cliente', 'admin', 'owner') NOT NULL DEFAULT 'cliente'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('admin', 'cliente') NOT NULL DEFAULT 'cliente'`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`cep\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`cep\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`estado\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`estado\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`bairro\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`bairro\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`numero\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`numero\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`is_primary\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`complemento\``);
        await queryRunner.query(`ALTER TABLE \`carrinho\` DROP COLUMN \`quantidade\``);
    }

}
