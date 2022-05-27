import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class SampleMigrationTIMESTAMP implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
      const hasWorkoutsTable = await queryRunner.hasTable('workouts')
      if (hasWorkoutsTable) {
        await queryRunner.addColumn(
          'workouts',
          new TableColumn({
            name: 'questionSetId',
            type: 'text',
            // we make the new field nullable in order to enable the update
            // for existing data (schema sync will later update this column to be non
            // nullable)
            isNullable: true,
          }),
        )
        await queryRunner.query(
          `UPDATE workouts SET questionSetId = "MIGRATION-PLACEHOLDER" WHERE questionSetId IS NULL`,
        )
      }
    }

    async down(queryRunner: QueryRunner) {
      const hasWorkoutsTable = await queryRunner.hasTable('workouts')
      if (hasWorkoutsTable) {
        await queryRunner.dropColumn('workouts', 'questionSetId')
      }
    }
}