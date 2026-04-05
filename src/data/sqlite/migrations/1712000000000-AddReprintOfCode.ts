import { MigrationInterface, QueryRunner } from 'typeorm/browser';

export class AddReprintOfCode1712000000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const columns: { name: string }[] = await queryRunner.query(`PRAGMA table_info(card)`);
    const hasColumn = columns.some(c => c.name === 'reprint_of_code');
    if (!hasColumn) {
      await queryRunner.query(`ALTER TABLE card ADD COLUMN reprint_of_code text`);
    }
    await queryRunner.query(
      `UPDATE card SET reprint_of_code = duplicate_of_code, duplicate_of_code = NULL WHERE pack_code = 'core_2026'`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE card SET duplicate_of_code = reprint_of_code WHERE pack_code = 'core_2026' AND reprint_of_code IS NOT NULL`
    );
  }
}
