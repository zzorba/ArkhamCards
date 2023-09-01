import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class TabooTextMigration1693598075386 implements MigrationInterface {
  name: string = 'TabooTextMigration1693598075386';
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'taboo_original_text',
          type: 'text',
          isNullable: true,
        }),
      );
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'taboo_original_back_text',
          type: 'text',
          isNullable: true,
        }),
      )
    }
  }

  async down(queryRunner: QueryRunner) {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.dropColumn('cards', 'taboo_original_text');
      await queryRunner.dropColumn('cards', 'taboo_original_back_text');
    }
  }
}