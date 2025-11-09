import { MigrationInterface, QueryRunner } from "typeorm";

export class Tabelascriadas1761010713611 implements MigrationInterface {
    name = 'Tabelascriadas1761010713611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`avaliacoes_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`avaliacoes\` text NOT NULL, \`rating\` enum ('1', '2', '3', '4', '5') NOT NULL DEFAULT '5', \`produto_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`midias\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` varchar(255) NOT NULL, \`tipo\` enum ('imagem', 'video') NOT NULL DEFAULT 'imagem', \`public_id\` varchar(255) NULL, \`produto_id\` int NULL, \`avaliacao_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`catalogos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`catalogo_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`catalogo_id\` int NOT NULL, \`produto_id\` int NOT NULL, \`quantidade\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categorias\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` text NULL, \`slug\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_d7c32fbaefae4a73773e52c316\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comentario_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`comentario\` text NOT NULL, \`produto_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`categoria_id\` int NOT NULL, \`status\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`nome\` varchar(255) NOT NULL, \`descricao\` text NULL, \`preco\` decimal(10,2) NOT NULL DEFAULT '0.00', \`peso\` decimal(10,2) NOT NULL, \`largura\` decimal(10,2) NOT NULL, \`altura\` decimal(10,2) NOT NULL, \`comprimento\` decimal(10,2) NOT NULL, UNIQUE INDEX \`IDX_64fbbaea303f9816067b6a4e09\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`carrinho_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`carrinho_id\` int NOT NULL, \`produto_id\` int NOT NULL, \`quantidade\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`carrinho\` (\`id\` int NOT NULL AUTO_INCREMENT, \`produto_id\` int NOT NULL, \`user_id\` int NOT NULL, \`criado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customer_address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`logradouro\` varchar(255) NULL, \`numero\` varchar(255) NULL, \`bairro\` varchar(255) NULL, \`cidade\` varchar(255) NULL, \`estado\` varchar(255) NULL, \`cep\` varchar(255) NULL, UNIQUE INDEX \`REL_461eb4f521390db881a417437c\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`birthDate\` date NULL, \`cpf\` varchar(255) NULL, \`password\` varchar(255) NULL, \`role\` enum ('admin', 'cliente') NOT NULL DEFAULT 'cliente', \`criado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_a6235b5ef0939d8deaad755fc8\` (\`cpf\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vendas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`data_venda\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`valor_total\` decimal(10,2) NULL, \`status\` enum ('pendente', 'confirmado', 'cancelado') NOT NULL DEFAULT 'pendente', \`observacoes\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vendas_produtos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`venda_id\` int NOT NULL, \`produto_id\` int NOT NULL, \`quantidade\` int NOT NULL DEFAULT '1', \`preco_unitario\` decimal(10,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`avaliacoes_produtos\` ADD CONSTRAINT \`FK_a49738c76d06a89347965bf8406\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`avaliacoes_produtos\` ADD CONSTRAINT \`FK_a960f5c695383bd55a8426652fc\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`midias\` ADD CONSTRAINT \`FK_4cfcdf96bd83d43da671491a6b4\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`midias\` ADD CONSTRAINT \`FK_0efb8ca1ff466fe9c35c9748274\` FOREIGN KEY (\`avaliacao_id\`) REFERENCES \`avaliacoes_produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` ADD CONSTRAINT \`FK_225417ab5f40fb61cae33cb5bb6\` FOREIGN KEY (\`catalogo_id\`) REFERENCES \`catalogos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` ADD CONSTRAINT \`FK_491795f07586b2adf043f6725fe\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comentario_produtos\` ADD CONSTRAINT \`FK_d0c75f24df45e8ed7f2be343e1a\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comentario_produtos\` ADD CONSTRAINT \`FK_e88433ca204dd79db4a94675035\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD CONSTRAINT \`FK_330ac6c492cb0bbcce953f3d9eb\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` ADD CONSTRAINT \`FK_be9e544d48b34f47cb0bf76dc49\` FOREIGN KEY (\`carrinho_id\`) REFERENCES \`carrinho\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` ADD CONSTRAINT \`FK_84ab75c2938aca8a164a543c9c5\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carrinho\` ADD CONSTRAINT \`FK_24fdf1f8fb2231e964ba154b609\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD CONSTRAINT \`FK_461eb4f521390db881a417437c1\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vendas\` ADD CONSTRAINT \`FK_c2bb68bb03e52e743cb78a69463\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vendas_produtos\` ADD CONSTRAINT \`FK_da4c556d62acc2939937f1ce6ad\` FOREIGN KEY (\`venda_id\`) REFERENCES \`vendas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vendas_produtos\` ADD CONSTRAINT \`FK_53cc985750bf5de05aa81d4d6d3\` FOREIGN KEY (\`produto_id\`) REFERENCES \`produtos\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vendas_produtos\` DROP FOREIGN KEY \`FK_53cc985750bf5de05aa81d4d6d3\``);
        await queryRunner.query(`ALTER TABLE \`vendas_produtos\` DROP FOREIGN KEY \`FK_da4c556d62acc2939937f1ce6ad\``);
        await queryRunner.query(`ALTER TABLE \`vendas\` DROP FOREIGN KEY \`FK_c2bb68bb03e52e743cb78a69463\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP FOREIGN KEY \`FK_461eb4f521390db881a417437c1\``);
        await queryRunner.query(`ALTER TABLE \`carrinho\` DROP FOREIGN KEY \`FK_24fdf1f8fb2231e964ba154b609\``);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` DROP FOREIGN KEY \`FK_84ab75c2938aca8a164a543c9c5\``);
        await queryRunner.query(`ALTER TABLE \`carrinho_produtos\` DROP FOREIGN KEY \`FK_be9e544d48b34f47cb0bf76dc49\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP FOREIGN KEY \`FK_330ac6c492cb0bbcce953f3d9eb\``);
        await queryRunner.query(`ALTER TABLE \`comentario_produtos\` DROP FOREIGN KEY \`FK_e88433ca204dd79db4a94675035\``);
        await queryRunner.query(`ALTER TABLE \`comentario_produtos\` DROP FOREIGN KEY \`FK_d0c75f24df45e8ed7f2be343e1a\``);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` DROP FOREIGN KEY \`FK_491795f07586b2adf043f6725fe\``);
        await queryRunner.query(`ALTER TABLE \`catalogo_produtos\` DROP FOREIGN KEY \`FK_225417ab5f40fb61cae33cb5bb6\``);
        await queryRunner.query(`ALTER TABLE \`midias\` DROP FOREIGN KEY \`FK_0efb8ca1ff466fe9c35c9748274\``);
        await queryRunner.query(`ALTER TABLE \`midias\` DROP FOREIGN KEY \`FK_4cfcdf96bd83d43da671491a6b4\``);
        await queryRunner.query(`ALTER TABLE \`avaliacoes_produtos\` DROP FOREIGN KEY \`FK_a960f5c695383bd55a8426652fc\``);
        await queryRunner.query(`ALTER TABLE \`avaliacoes_produtos\` DROP FOREIGN KEY \`FK_a49738c76d06a89347965bf8406\``);
        await queryRunner.query(`DROP TABLE \`vendas_produtos\``);
        await queryRunner.query(`DROP TABLE \`vendas\``);
        await queryRunner.query(`DROP INDEX \`IDX_a6235b5ef0939d8deaad755fc8\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_461eb4f521390db881a417437c\` ON \`customer_address\``);
        await queryRunner.query(`DROP TABLE \`customer_address\``);
        await queryRunner.query(`DROP TABLE \`carrinho\``);
        await queryRunner.query(`DROP TABLE \`carrinho_produtos\``);
        await queryRunner.query(`DROP INDEX \`IDX_64fbbaea303f9816067b6a4e09\` ON \`produtos\``);
        await queryRunner.query(`DROP TABLE \`produtos\``);
        await queryRunner.query(`DROP TABLE \`comentario_produtos\``);
        await queryRunner.query(`DROP INDEX \`IDX_d7c32fbaefae4a73773e52c316\` ON \`categorias\``);
        await queryRunner.query(`DROP TABLE \`categorias\``);
        await queryRunner.query(`DROP TABLE \`catalogo_produtos\``);
        await queryRunner.query(`DROP TABLE \`catalogos\``);
        await queryRunner.query(`DROP TABLE \`midias\``);
        await queryRunner.query(`DROP TABLE \`avaliacoes_produtos\``);
    }

}
