import { MigrationInterface, QueryRunner } from "typeorm";

export class CriacaoTabelas1758594073736 implements MigrationInterface {
    name = 'CriacaoTabelas1758594073736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`midias\` (\`id\` int NOT NULL AUTO_INCREMENT, \`produto_id\` int NOT NULL, \`url\` varchar(255) NOT NULL, \`tipo\` enum ('imagem', 'video') NOT NULL DEFAULT 'imagem', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`catalogos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`catalogo_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`catalogo_id\` int NOT NULL, \`produto_id\` int NOT NULL, \`quantidade\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categorias\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`categoria_id\` int NOT NULL, \`nome\` varchar(255) NOT NULL, \`descricao\` text NULL, \`preco\` decimal(10,2) NOT NULL DEFAULT '0.00', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`carrinho_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`carrinho_id\` int NOT NULL, \`produto_id\` int NOT NULL, \`quantidade\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`carrinho\` (\`id\` int NOT NULL AUTO_INCREMENT, \`produto_id\` int NOT NULL, \`user_id\` int NOT NULL, \`criado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customer_address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`logradouro\` varchar(255) NULL, \`numero\` varchar(255) NULL, \`bairro\` varchar(255) NULL, \`cidade\` varchar(255) NULL, \`estado\` varchar(255) NULL, \`cep\` varchar(255) NULL, UNIQUE INDEX \`REL_461eb4f521390db881a417437c\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`birthDate\` date NULL, \`cpf\` varchar(255) NULL, \`password\` varchar(255) NULL, \`role\` enum ('admin', 'cliente') NOT NULL DEFAULT 'cliente', \`criado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_230b925048540454c8b4c481e1\` (\`cpf\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vendas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`data_venda\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`valor_total\` decimal(10,2) NULL, \`status\` enum ('pendente', 'confirmado', 'cancelado') NOT NULL DEFAULT 'pendente', \`observacoes\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`midias\` ADD CONSTRAINT \`FK_4cfcdf96bd83d43da671491a6b4\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` ADD CONSTRAINT \`FK_225417ab5f40fb61cae33cb5bb6\` FOREIGN KEY (\`catalogo_id\`) REFERENCES \`catalogos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` ADD CONSTRAINT \`FK_491795f07586b2adf043f6725fe\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD CONSTRAINT \`FK_330ac6c492cb0bbcce953f3d9eb\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` ADD CONSTRAINT \`FK_be9e544d48b34f47cb0bf76dc49\` FOREIGN KEY (\`carrinho_id\`) REFERENCES \`carrinho\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` ADD CONSTRAINT \`FK_84ab75c2938aca8a164a543c9c5\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carrinho\` ADD CONSTRAINT \`FK_24fdf1f8fb2231e964ba154b609\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD CONSTRAINT \`FK_461eb4f521390db881a417437c1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vendas\` ADD CONSTRAINT \`FK_c2bb68bb03e52e743cb78a69463\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vendas\` DROP FOREIGN KEY \`FK_c2bb68bb03e52e743cb78a69463\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP FOREIGN KEY \`FK_461eb4f521390db881a417437c1\``);
        await queryRunner.query(`ALTER TABLE \`carrinho\` DROP FOREIGN KEY \`FK_24fdf1f8fb2231e964ba154b609\``);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` DROP FOREIGN KEY \`FK_84ab75c2938aca8a164a543c9c5\``);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` DROP FOREIGN KEY \`FK_be9e544d48b34f47cb0bf76dc49\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP FOREIGN KEY \`FK_330ac6c492cb0bbcce953f3d9eb\``);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` DROP FOREIGN KEY \`FK_491795f07586b2adf043f6725fe\``);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` DROP FOREIGN KEY \`FK_225417ab5f40fb61cae33cb5bb6\``);
        await queryRunner.query(`ALTER TABLE \`midias\` DROP FOREIGN KEY \`FK_4cfcdf96bd83d43da671491a6b4\``);
        await queryRunner.query(`DROP TABLE \`vendas\``);
        await queryRunner.query(`DROP INDEX \`IDX_230b925048540454c8b4c481e1\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_461eb4f521390db881a417437c\` ON \`customer_address\``);
        await queryRunner.query(`DROP TABLE \`customer_address\``);
        await queryRunner.query(`DROP TABLE \`carrinho\``);
        await queryRunner.query(`DROP TABLE \`carrinho_produtos\``);
        await queryRunner.query(`DROP TABLE \`produtos\``);
        await queryRunner.query(`DROP TABLE \`categorias\``);
        await queryRunner.query(`DROP TABLE \`catalogo_produtos\``);
        await queryRunner.query(`DROP TABLE \`catalogos\``);
        await queryRunner.query(`DROP TABLE \`midias\``);
    }

}
