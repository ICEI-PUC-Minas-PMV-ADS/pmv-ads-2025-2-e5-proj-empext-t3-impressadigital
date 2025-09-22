import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1758497058320 implements MigrationInterface {
    name = 'CreateUsers1758497058320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`carrinho\` DROP FOREIGN KEY \`FK_1b7d1f7ddc503a13a33da5137a6\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP FOREIGN KEY \`FK_3c8202fcdb79fe94eaa0fbe8688\``);
        await queryRunner.query(`ALTER TABLE \`vendas\` DROP FOREIGN KEY \`FK_f6e45a35bd62e5ac0ef01eff5f0\``);
        await queryRunner.query(`DROP INDEX \`REL_3c8202fcdb79fe94eaa0fbe868\` ON \`customer_address\``);
        await queryRunner.query(`ALTER TABLE \`carrinho\` CHANGE \`pessoa_id\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vendas\` CHANGE \`pessoa_id\` \`user_id\` int NOT NULL`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`senha\` varchar(255) NULL, \`tipo\` enum ('admin', 'cliente') NOT NULL DEFAULT 'cliente', \`criado_em\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD UNIQUE INDEX \`IDX_461eb4f521390db881a417437c\` (\`user_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_461eb4f521390db881a417437c\` ON \`customer_address\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`carrinho\` ADD CONSTRAINT \`FK_24fdf1f8fb2231e964ba154b609\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD CONSTRAINT \`FK_461eb4f521390db881a417437c1\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vendas\` ADD CONSTRAINT \`FK_c2bb68bb03e52e743cb78a69463\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vendas\` DROP FOREIGN KEY \`FK_c2bb68bb03e52e743cb78a69463\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP FOREIGN KEY \`FK_461eb4f521390db881a417437c1\``);
        await queryRunner.query(`ALTER TABLE \`carrinho\` DROP FOREIGN KEY \`FK_24fdf1f8fb2231e964ba154b609\``);
        await queryRunner.query(`DROP INDEX \`REL_461eb4f521390db881a417437c\` ON \`customer_address\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP INDEX \`IDX_461eb4f521390db881a417437c\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`ALTER TABLE \`vendas\` CHANGE \`user_id\` \`pessoa_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`carrinho\` CHANGE \`user_id\` \`pessoa_id\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_3c8202fcdb79fe94eaa0fbe868\` ON \`customer_address\` (\`pessoa_id\`)`);
        await queryRunner.query(`ALTER TABLE \`vendas\` ADD CONSTRAINT \`FK_f6e45a35bd62e5ac0ef01eff5f0\` FOREIGN KEY (\`pessoa_id\`) REFERENCES \`pessoas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD CONSTRAINT \`FK_3c8202fcdb79fe94eaa0fbe8688\` FOREIGN KEY (\`pessoa_id\`) REFERENCES \`pessoas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`carrinho\` ADD CONSTRAINT \`FK_1b7d1f7ddc503a13a33da5137a6\` FOREIGN KEY (\`pessoa_id\`) REFERENCES \`pessoas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
