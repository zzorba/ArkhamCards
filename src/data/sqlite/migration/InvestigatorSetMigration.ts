import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InvestigatorSetMigration1764345197527 implements MigrationInterface {
  name: string = 'InvestigatorSetMigration1764345197527';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Create the table
    await queryRunner.createTable(
      new Table({
        name: 'investigator_set',
        columns: [
          {
            name: 'code',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'alternate_codes',
            type: 'text',
            isNullable: false,
          },
        ],
      }),
      true // ifNotExists
    );

    // Populate the table with investigator relationships
    // This groups investigators by real_name and creates entries for each code
    await queryRunner.query(`
      WITH investigator_groups AS (
        SELECT
          real_name,
          GROUP_CONCAT(code) as all_codes
        FROM card
        WHERE type_code = 'investigator'
          AND taboo_set_id IS NULL
        GROUP BY real_name
      ),
      expanded AS (
        SELECT
          c.code,
          ig.all_codes as alternate_codes
        FROM card c
        JOIN investigator_groups ig ON c.real_name = ig.real_name
        WHERE c.type_code = 'investigator'
          AND c.taboo_set_id IS NULL
      )
      INSERT INTO investigator_set (code, alternate_codes)
      SELECT code, alternate_codes
      FROM expanded
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('investigator_set', true);
  }
}
