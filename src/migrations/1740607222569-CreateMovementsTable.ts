import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMovementsTable1740607222569 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "movements",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "destination_branch_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "product_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "driver_id",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "quantity",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["PENDING", "IN_PROGRESS", "FINISHED"],
                        default: "'PENDING'",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            })
        );

        await queryRunner.createForeignKeys("movements", [
            new TableForeignKey({
                columnNames: ["destination_branch_id"],
                referencedTableName: "branches",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["product_id"],
                referencedTableName: "products",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            }),
            new TableForeignKey({
                columnNames: ["driver_id"],
                referencedTableName: "drivers",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("movements");
    }

}
