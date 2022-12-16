import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ReprintQuantityMigration1671202311300 implements MigrationInterface {
  name: string = 'ReprintQuantityMigration1671202311300';
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'reprint_info',
          type: 'simple-json',
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
      await queryRunner.dropColumn('cards', 'reprint_info')
    }
  }
}