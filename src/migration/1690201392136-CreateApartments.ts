import {MigrationInterface, QueryRunner} from "typeorm"

export class CreateApartments1690200387766 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE apartment
                (
                    id              UUID PRIMARY KEY            NOT NULL,
                    external_id     VARCHAR(32)                 NOT NULL,
                    title           TEXT                        NOT NULL,
                    description     TEXT                        NOT NULL,
                    address         TEXT                        NOT NULL,
                    location        POINT                       NOT NULL,
                    prices_monthly  NUMERIC(8, 2)               NOT NULL,
                    prices_weekly   NUMERIC(8, 2)               NOT NULL,
                    prices_currency CHAR(3)                     NOT NULL,
                    image           TEXT                        NOT NULL,
                    url             TEXT                        NOT NULL,
                    message_url     TEXT                        NOT NULL,
                    adapter_name    VARCHAR(20)                 NOT NULL,
                    published_on    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                    created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL
                )`
        );
        await queryRunner.query(`
            CREATE INDEX idx_apartment_external_id ON apartment (external_id);
            CREATE INDEX idx_apartment_adapter_name ON apartment (adapter_name);
            CREATE INDEX uq_idx_apartment_adapter_name_external_id ON apartment (adapter_name, external_id);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('apartment')
        await queryRunner.query(`
            DROP INDEX idx_apartment_external_id;
            DROP INDEX idx_apartment_adapter_name;
            DROP INDEX uq_idx_apartment_adapter_name_external_id;
        `)
    }
}
