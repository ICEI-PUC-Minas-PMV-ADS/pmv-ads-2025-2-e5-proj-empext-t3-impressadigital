import { MigrationInterface, QueryRunner } from "typeorm";

export class AlteracaoEndereco1758245566311 implements MigrationInterface {
    name = 'AlteracaoEndereco1758245566311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP FOREIGN KEY \`FK_3c8202fcdb79fe94eaa0fbe8688\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD UNIQUE INDEX \`IDX_3c8202fcdb79fe94eaa0fbe868\` (\`pessoa_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_3c8202fcdb79fe94eaa0fbe868\` ON \`customer_address\` (\`pessoa_id\`)`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD CONSTRAINT \`FK_3c8202fcdb79fe94eaa0fbe8688\` FOREIGN KEY (\`pessoa_id\`) REFERENCES \`pessoas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP FOREIGN KEY \`FK_3c8202fcdb79fe94eaa0fbe8688\``);
        await queryRunner.query(`DROP INDEX \`REL_3c8202fcdb79fe94eaa0fbe868\` ON \`customer_address\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` DROP INDEX \`IDX_3c8202fcdb79fe94eaa0fbe868\``);
        await queryRunner.query(`ALTER TABLE \`customer_address\` ADD CONSTRAINT \`FK_3c8202fcdb79fe94eaa0fbe8688\` FOREIGN KEY (\`pessoa_id\`) REFERENCES \`pessoas\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
