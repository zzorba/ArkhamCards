import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class GenderMigration1663271269593 implements MigrationInterface {
  name: string = 'GenderMigration1663271269593';
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'gender',
          type: 'text',
          isNullable: true,
        }),
      )
    }
  }

  async down(queryRunner: QueryRunner) {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.dropColumn('cards', 'gender')
    }
  }
}