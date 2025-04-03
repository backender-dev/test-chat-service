import { EMessageStatus } from '@app/common/enums/message-status.enum';
import { EMessageType } from '@app/common/enums/message-type.enum';
import { UUID } from '@app/common/types';
import { TABLE_MESSAGES } from '@app/database/tables';
import { UserEntity } from '@app/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(TABLE_MESSAGES)
@Index('IDX_sender', ['sender.id'])
@Index('IDX_dialog', ['dialogId'])
@Index('IDX_created_at', ['createdAt'])
@Index('IDX_updated_at', ['updatedAt'])
export class MessageEntity {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: UUID;

  @ManyToOne(() => UserEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
  sender: UserEntity;

  @Column({ name: 'dialog_id', type: 'uuid', nullable: false })
  dialogId: UUID;

  @Column({ type: 'enum', enum: EMessageStatus, nullable: false })
  status: EMessageStatus;

  @Column({ type: 'enum', enum: EMessageType, nullable: false })
  type: EMessageType;

  @Column({ type: 'varchar', nullable: true })
  content?: string;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  caption?: string;

  @Column({ name: 'video_url', type: 'varchar', nullable: true })
  videoUrl?: string;

  @Column({ name: 'thumbnail_url', type: 'varchar', nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'int', nullable: true })
  duration?: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
