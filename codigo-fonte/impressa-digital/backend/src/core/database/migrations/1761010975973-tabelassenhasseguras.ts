import { MigrationInterface, QueryRunner } from "typeorm";

export class Tabelassenhasseguras1761010975973 implements MigrationInterface {
    name = 'Tabelassenhasseguras1761010975973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`password_reset_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expiresAt\` datetime NOT NULL, \`used\` tinyint NOT NULL DEFAULT 0, \`userId\` int NULL, UNIQUE INDEX \`IDX_ab673f0e63eac966762155508e\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`password_reset_tokens\` ADD CONSTRAINT \`FK_d6a19d4b4f6c62dcd29daa497e2\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`password_reset_tokens\` DROP FOREIGN KEY \`FK_d6a19d4b4f6c62dcd29daa497e2\``);
        await queryRunner.query(`DROP INDEX \`IDX_ab673f0e63eac966762155508e\` ON \`password_reset_tokens\``);
        await queryRunner.query(`DROP TABLE \`password_reset_tokens\``);
    }

}
