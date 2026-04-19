import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm/browser';

export class AddReprintOfCode1744329600000 implements MigrationInterface {
  name: string = 'AddReprintOfCode1744329600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardTable = await queryRunner.hasTable('card');
    if (hasCardTable) {
      const hasColumn = await queryRunner.hasColumn('card', 'reprint_of_code');
      if (!hasColumn) {
        await queryRunner.addColumn(
          'card',
          new TableColumn({
            name: 'reprint_of_code',
            type: 'text',
            // we make the new field nullable in order to enable the update
            // for existing data (schema sync will later update this column to be non
            // nullable)
            isNullable: true,
          }),
        );
        await queryRunner.query(
          `UPDATE card SET reprint_of_code = duplicate_of_code, duplicate_of_code = NULL WHERE pack_code = 'core_2026'`
        );
      }
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const hasCardTable = await queryRunner.hasTable('card');
    if (hasCardTable) {
      await queryRunner.query(
        `UPDATE card SET duplicate_of_code = reprint_of_code WHERE pack_code = 'core_2026' AND reprint_of_code IS NOT NULL`
      );
      await queryRunner.dropColumn('card', 'reprint_of_code');
    }
  }
}
