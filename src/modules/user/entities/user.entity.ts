import { UUID } from '@app/common/types';
import { TABLE_USERS } from '@app/database/tables';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity(TABLE_USERS)
export class UserEntity {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: UUID;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
