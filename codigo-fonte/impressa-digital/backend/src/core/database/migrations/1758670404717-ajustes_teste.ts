import { MigrationInterface, QueryRunner } from "typeorm";

export class AjustesTeste1758670404717 implements MigrationInterface {
    name = 'AjustesTeste1758670404717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`teste\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`teste\` varchar(255) NOT NULL`);
    }

}
