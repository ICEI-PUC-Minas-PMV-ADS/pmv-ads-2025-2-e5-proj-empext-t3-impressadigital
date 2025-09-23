import { MigrationInterface, QueryRunner } from "typeorm";

export class Ajustes1758670347543 implements MigrationInterface {
    name = 'Ajustes1758670347543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`status_produtos\` \`teste\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`teste\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`teste\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`teste\``);
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`teste\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` CHANGE \`teste\` \`status_produtos\` varchar(255) NOT NULL`);
    }

}
