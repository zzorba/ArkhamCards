import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CustomizeMigration1657651357621 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'customization_options',
          type: 'simple-json',
          isNullable: true,
        }),
      )
    }
  }

  async down(queryRunner: QueryRunner) {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.dropColumn('cards', 'customization_options')
    }
  }
}