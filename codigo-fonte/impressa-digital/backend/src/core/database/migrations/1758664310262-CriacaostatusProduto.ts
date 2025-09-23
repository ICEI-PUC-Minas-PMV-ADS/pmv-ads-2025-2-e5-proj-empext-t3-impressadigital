import { MigrationInterface, QueryRunner } from "typeorm";

export class CriacaostatusProduto1758664310262 implements MigrationInterface {
    name = 'CriacaostatusProduto1758664310262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`status_produtos\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`status_produtos\``);
    }

}
