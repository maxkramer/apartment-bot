import {MigrationInterface, QueryRunner} from "typeorm"

export class CreateExtensions1690200387764 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE EXTENSION IF NOT EXISTS "postgis";
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP EXTENSION "uuid-ossp";
        DROP EXTENSION "postgis";
        `)
    }
}
