import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlternateRequiredCodeMigration1660064759967 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'alternate_required_code',
          type: 'text',
          // we make the new field nullable in order to enable the update
          // for existing data (schema sync will later update this column to be non
          // nullable)
          isNullable: true,
        }),
      )
    }
  }

  async down(queryRunner: QueryRunner) {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.dropColumn('cards', 'alternate_required_code')
    }
  }
}