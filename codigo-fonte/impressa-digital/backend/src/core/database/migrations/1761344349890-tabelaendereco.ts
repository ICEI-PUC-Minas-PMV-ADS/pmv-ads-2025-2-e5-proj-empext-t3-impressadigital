import { MigrationInterface, QueryRunner } from "typeorm";

export class ResetCustomerAddressTable1680000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS customer_address`);

        await queryRunner.query(`
            CREATE TABLE customer_address (
                id INT NOT NULL AUTO_INCREMENT,
                user_id INT NOT NULL,
                logradouro VARCHAR(255),
                numero VARCHAR(20),
                complemento VARCHAR(255),
                bairro VARCHAR(100),
                cidade VARCHAR(255),
                estado VARCHAR(100),
                cep VARCHAR(9),
                is_primary BOOLEAN DEFAULT FALSE,
                PRIMARY KEY (id),
                INDEX IDX_user_id (user_id),
                CONSTRAINT FK_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE customer_address`);
    }
}
