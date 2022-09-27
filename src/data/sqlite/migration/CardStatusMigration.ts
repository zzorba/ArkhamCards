import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CardStatusMigration1662999387731 implements MigrationInterface {
  name: string = 'CardStatusMigration1662999387731';
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'status',
          type: 'text',
          isNullable: true,
        }),
      )
    }
  }

  async down(queryRunner: QueryRunner) {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.dropColumn('cards', 'status')
    }
  }
}