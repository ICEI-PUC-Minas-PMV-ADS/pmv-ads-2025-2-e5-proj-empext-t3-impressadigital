import { MigrationInterface, QueryRunner } from "typeorm";

export class AjusteDeCascate1758246098659 implements MigrationInterface {
    name = 'AjusteDeCascate1758246098659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3c8202fcdb79fe94eaa0fbe868\` ON \`customer_address\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_3c8202fcdb79fe94eaa0fbe868\` ON \`customer_address\` (\`pessoa_id\`)`);
    }

}
