import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemovableSlot1658075280573 implements MigrationInterface {
  name: string = 'RemovableSlot1658075280573';
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'removable_slot',
          type: 'boolean',
          isNullable: true,
        }),
      )
    }
  }

  async down(queryRunner: QueryRunner) {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.dropColumn('cards', 'removable_slot')
    }
  }
}