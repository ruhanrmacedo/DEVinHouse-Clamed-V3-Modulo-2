import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class UserTables1740101198497 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          { 
            name: "name", 
            type: "varchar", 
            length: "200", 
            isNullable: false 
          },
          {
            name: "profile",
            type: "enum",
            enum: ["DRIVER", "BRANCH", "ADMIN"],
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            length: "150",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "password_hash",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          { 
            name: "status", 
            type: "boolean", 
            default: "true" 
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
          },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "branches",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "full_address",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "document",
            type: "varchar",
            length: "30",
            isNullable: false,
          },
          { 
            name: "user_id", 
            type: "uuid", 
            isNullable: false 
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
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          }),
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "drivers",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "full_address",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "document",
            type: "varchar",
            length: "30",
            isNullable: false,
          },
          { 
            name: "user_id", 
            type: "uuid", 
            isNullable: false 
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
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("drivers");
    await queryRunner.dropTable("branches");
    await queryRunner.dropTable("users");
  }
}
