import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CardTagsMigraiton1663617607335 implements MigrationInterface {
  name: string = 'CardTagsMigraiton1663617607335';
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'tags',
          type: 'simple-array',
          isNullable: true,
        }),
      )
    }
  }

  async down(queryRunner: QueryRunner) {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.dropColumn('cards', 'tags')
    }
  }
}