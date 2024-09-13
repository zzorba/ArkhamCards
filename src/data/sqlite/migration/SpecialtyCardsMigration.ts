import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class SpecialtyCardsMigration1726180741370
  implements MigrationInterface
{
  name: string = "SpecialtyCardsMigration1726180741370";
  async up(queryRunner: QueryRunner): Promise<void> {
    const hasCardsTable = await queryRunner.hasTable("cards");
    if (hasCardsTable) {
      await queryRunner.addColumn(
        "cards",
        new TableColumn({
          name: "restrictions_trait",
          type: "text",
          // we make the new field nullable in order to enable the update
          // for existing data (schema sync will later update this column to be non
          // nullable)
          isNullable: true,
        })
      );
      await queryRunner.addColumn(
        "cards",
        new TableColumn({
          name: "restrictions_faction",
          type: "text",
          // we make the new field nullable in order to enable the update
          // for existing data (schema sync will later update this column to be non
          // nullable)
          isNullable: true,
        })
      );
    }
  }

  async down(queryRunner: QueryRunner) {
    const hasCardsTable = await queryRunner.hasTable("cards");
    if (hasCardsTable) {
      await queryRunner.dropColumn("cards", "restrictions_trait");
      await queryRunner.dropColumn("cards", "restrictions_faction");
    }
  }
}
