import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_USERS = 'users';
export class UserTable1743636522853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_USERS,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          { name: 'avatar', type: 'varchar', length: '255', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_USERS);
  }
}
