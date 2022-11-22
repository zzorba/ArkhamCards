import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ImageMigration1665529094145 implements MigrationInterface {
  name: string = 'ImageMigration1665529094145';
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'imageurl',
          type: 'text',
          isNullable: true,
        }),
      );

      await queryRunner.addColumn(
        'cards',
        new TableColumn({
          name: 'backimageurl',
          type: 'text',
          isNullable: true,
        }),
      )
    }
  }

  async down(queryRunner: QueryRunner) {
    const hasCardsTable = await queryRunner.hasTable('cards')
    if (hasCardsTable) {
      await queryRunner.dropColumn('cards', 'imageurl')
      await queryRunner.dropColumn('cards', 'backimageurl')
    }
  }
}