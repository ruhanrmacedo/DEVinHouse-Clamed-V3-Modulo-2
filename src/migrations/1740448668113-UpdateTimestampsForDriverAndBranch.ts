import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTimestampsForDriverAndBranch1740448668113
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE drivers 
            ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
        `);

    await queryRunner.query(`
            ALTER TABLE branches 
            ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
        `);

    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER trigger_update_drivers
            BEFORE UPDATE ON drivers
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);

    await queryRunner.query(`
            CREATE TRIGGER trigger_update_branches
            BEFORE UPDATE ON branches
            FOR EACH ROW
            EXECUTE FUNCTION update_timestamp();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TRIGGER IF EXISTS trigger_update_drivers ON drivers;
        `);

    await queryRunner.query(`
            DROP TRIGGER IF EXISTS trigger_update_branches ON branches;
        `);

    await queryRunner.query(`
            DROP FUNCTION IF EXISTS update_timestamp;
        `);

    await queryRunner.query(`
            ALTER TABLE drivers 
            ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
        `);

    await queryRunner.query(`
            ALTER TABLE branches 
            ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
        `);
  }
}
