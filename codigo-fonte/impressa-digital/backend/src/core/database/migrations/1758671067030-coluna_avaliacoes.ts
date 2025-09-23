import { MigrationInterface, QueryRunner } from "typeorm";

export class ColunaAvaliacoes1758671067030 implements MigrationInterface {
    name = 'ColunaAvaliacoes1758671067030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avaliacoes\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avaliacoes\``);
    }

}
