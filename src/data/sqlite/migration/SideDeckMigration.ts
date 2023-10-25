import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SideDeckMigration1698073688677 implements MigrationInterface {
  name: string = 'SideDeckMigration1698073688677';
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'side_deck_requirements',
          type: 'simple-json',
          isNullable: true,
        }),
      );
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'side_deck_options',
          type: 'simple-json',
          isNullable: true,
        }),
      )
    }
  }

  async down(queryRunner: QueryRunner) {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.dropColumn('cards', 'side_deck_requirements');
      await queryRunner.dropColumn('cards', 'side_deck_options');
    }
  }
}