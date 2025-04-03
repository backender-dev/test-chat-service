import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

const TABLE_MESSAGES = 'messages';
export class MessageTable1743689590785 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_MESSAGES,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, isNullable: false },
          { name: 'sender_id', type: 'uuid', isNullable: false },
          { name: 'dialog_id', type: 'uuid', isNullable: false },
          {
            name: 'status',
            type: 'enum',
            enum: ['sent', 'delivered'],
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['text', 'image', 'video'],
            isNullable: false,
          },
          { name: 'content', type: 'varchar', isNullable: true },
          { name: 'image_url', type: 'varchar', isNullable: true },
          { name: 'caption', type: 'varchar', isNullable: true },
          { name: 'video_url', type: 'varchar', isNullable: true },
          { name: 'thumbnail_url', type: 'varchar', isNullable: true },
          { name: 'duration', type: 'int', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['sender_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
        ],
        indices: [
          {
            name: 'IDX_sender',
            columnNames: ['sender_id'],
          },
          {
            name: 'IDX_dialog',
            columnNames: ['dialog_id'],
          },
          {
            name: 'IDX_created_at',
            columnNames: ['created_at'],
          },
          {
            name: 'IDX_updated_at',
            columnNames: ['updated_at'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_MESSAGES);
  }
}
