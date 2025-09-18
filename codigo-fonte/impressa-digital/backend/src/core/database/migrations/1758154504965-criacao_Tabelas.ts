import { MigrationInterface, QueryRunner } from "typeorm";

export class CriacaoTabelas1758154504965 implements MigrationInterface {
    name = 'CriacaoTabelas1758154504965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`midias\` (\`id\` int NOT NULL AUTO_INCREMENT, \`produto_id\` int NOT NULL, \`url\` varchar(255) NOT NULL, \`tipo\` enum ('imagem', 'video') NOT NULL DEFAULT 'imagem', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customer_address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`pessoa_id\` int NOT NULL, \`logradouro\` varchar(255) NULL, \`numero\` varchar(255) NULL, \`bairro\` varchar(255) NULL, \`cidade\` varchar(255) NULL, \`estado\` varchar(255) NULL, \`cep\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vendas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`pessoa_id\` int NOT NULL, \`data_venda\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`valor_total\` decimal(10,2) NULL, \`status\` enum ('pendente', 'confirmado', 'cancelado') NOT NULL DEFAULT 'pendente', \`observacoes\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pessoas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`senha\` varchar(255) NULL, \`tipo\` enum ('admin', 'cliente') NOT NULL DEFAULT 'cliente', \`criado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_7ceb74dc9f2caea4eae596ab6a\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`carrinho\` (\`id\` int NOT NULL AUTO_INCREMENT, \`produto_id\` int NOT NULL, \`criado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`pessoa_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`carrinho_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`carrinho_id\` int NOT NULL, \`produto_id\` int NOT NULL, \`quantidade\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categorias\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`categoria_id\` int NOT NULL, \`nome\` varchar(255) NOT NULL, \`descricao\` text NULL, \`preco\` decimal(10,2) NOT NULL DEFAULT '0.00', \`estoque\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`catalogo_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`catalogo_id\` int NOT NULL, \`produto_id\` int NOT NULL, \`quantidade\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`catalogos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`midias\` ADD CONSTRAINT \`FK_4cfcdf96bd83d43da671491a6b4\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD CONSTRAINT \`FK_3c8202fcdb79fe94eaa0fbe8688\` FOREIGN KEY (\`pessoa_id\`) REFERENCES \`pessoas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vendas\` ADD CONSTRAINT \`FK_f6e45a35bd62e5ac0ef01eff5f0\` FOREIGN KEY (\`pessoa_id\`) REFERENCES \`pessoas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carrinho\` ADD CONSTRAINT \`FK_1b7d1f7ddc503a13a33da5137a6\` FOREIGN KEY (\`pessoa_id\`) REFERENCES \`pessoas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` ADD CONSTRAINT \`FK_be9e544d48b34f47cb0bf76dc49\` FOREIGN KEY (\`carrinho_id\`) REFERENCES \`carrinho\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` ADD CONSTRAINT \`FK_84ab75c2938aca8a164a543c9c5\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD CONSTRAINT \`FK_330ac6c492cb0bbcce953f3d9eb\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` ADD CONSTRAINT \`FK_225417ab5f40fb61cae33cb5bb6\` FOREIGN KEY (\`catalogo_id\`) REFERENCES \`catalogos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` ADD CONSTRAINT \`FK_491795f07586b2adf043f6725fe\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` DROP FOREIGN KEY \`FK_491795f07586b2adf043f6725fe\``);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` DROP FOREIGN KEY \`FK_225417ab5f40fb61cae33cb5bb6\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP FOREIGN KEY \`FK_330ac6c492cb0bbcce953f3d9eb\``);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` DROP FOREIGN KEY \`FK_84ab75c2938aca8a164a543c9c5\``);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` DROP FOREIGN KEY \`FK_be9e544d48b34f47cb0bf76dc49\``);
        await queryRunner.query(`ALTER TABLE \`carrinho\` DROP FOREIGN KEY \`FK_1b7d1f7ddc503a13a33da5137a6\``);
        await queryRunner.query(`ALTER TABLE \`vendas\` DROP FOREIGN KEY \`FK_f6e45a35bd62e5ac0ef01eff5f0\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP FOREIGN KEY \`FK_3c8202fcdb79fe94eaa0fbe8688\``);
        await queryRunner.query(`ALTER TABLE \`midias\` DROP FOREIGN KEY \`FK_4cfcdf96bd83d43da671491a6b4\``);
        await queryRunner.query(`DROP TABLE \`catalogos\``);
        await queryRunner.query(`DROP TABLE \`catalogo_produtos\``);
        await queryRunner.query(`DROP TABLE \`produtos\``);
        await queryRunner.query(`DROP TABLE \`categorias\``);
        await queryRunner.query(`DROP TABLE \`carrinho_produtos\``);
        await queryRunner.query(`DROP TABLE \`carrinho\``);
        await queryRunner.query(`DROP INDEX \`IDX_7ceb74dc9f2caea4eae596ab6a\` ON \`pessoas\``);
        await queryRunner.query(`DROP TABLE \`pessoas\``);
        await queryRunner.query(`DROP TABLE \`vendas\``);
        await queryRunner.query(`DROP TABLE \`customer_address\``);
        await queryRunner.query(`DROP TABLE \`midias\``);
    }

}
