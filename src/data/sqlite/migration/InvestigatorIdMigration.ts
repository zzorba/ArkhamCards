import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class InvestigatorIdMigration1764434435446 implements MigrationInterface {
  name: string = 'InvestigatorIdMigration1764434435446';

  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardTable = await queryRunner.hasTable('cards');
    if (!hasCardTable) {
      return;
    }

    try {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'investigator_id',
          type: 'text',
          isNullable: true,
        })
      );
    } catch (e) {
      // Column already exists, skip
    }

    try {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'back_subname',
          type: 'text',
          isNullable: true,
        })
      );
    } catch (e) {
      // Column already exists, skip
    }

    try {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'back_traits',
          type: 'text',
          isNullable: true,
        })
      );
    } catch (e) {
      // Column already exists, skip
    }

    try {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'real_back_traits',
          type: 'text',
          isNullable: true,
        })
      );
    } catch (e) {
      // Column already exists, skip
    }

    try {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'back_traits_normalized',
          type: 'text',
          isNullable: true,
        })
      );
    } catch (e) {
      // Column already exists, skip
    }

    try {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'real_back_traits_normalized',
          type: 'text',
          isNullable: true,
        })
      );
    } catch (e) {
      // Column already exists, skip
    }

    // Backfill investigator_id from duplicate_of_code for investigators
    await queryRunner.query(`
      UPDATE cards
      SET investigator_id = duplicate_of_code
      WHERE type_code = 'investigator'
        AND duplicate_of_code IS NOT NULL
        AND investigator_id IS NULL
    `);

    // Backfill investigator_id from alternate_of_code for investigators
    await queryRunner.query(`
      UPDATE cards
      SET investigator_id = alternate_of_code
      WHERE type_code = 'investigator'
        AND alternate_of_code IS NOT NULL
        AND investigator_id IS NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const hasCardTable = await queryRunner.hasTable('cards');
    if (hasCardTable) {
      await queryRunner.dropColumn('cards', 'investigator_id');
      await queryRunner.dropColumn('cards', 'back_subname');
      await queryRunner.dropColumn('cards', 'back_traits');
      await queryRunner.dropColumn('cards', 'real_back_traits');
      await queryRunner.dropColumn('cards', 'back_traits_normalized');
      await queryRunner.dropColumn('cards', 'real_back_traits_normalized');
    }
  }
}
