import { EMessageStatus } from '@app/common/enums/message-status.enum';
import { ApiResponseProperty } from '@nestjs/swagger';
import { MessageEntity } from '../entities/message.entity';
import { UUID } from '@app/common/types';
import { EMessageType } from '@app/common/enums/message-type.enum';

export class ContentDto
  implements
    Omit<
      MessageEntity,
      'sender' | 'dialogId' | 'status' | 'createdAt' | 'updatedAt'
    >
{
  @ApiResponseProperty({ format: 'uuid' })
  id: UUID;

  @ApiResponseProperty({ enum: EMessageStatus })
  type: EMessageType;

  @ApiResponseProperty()
  content?: string;

  @ApiResponseProperty()
  imageUrl?: string;

  @ApiResponseProperty()
  caption?: string;

  @ApiResponseProperty()
  videoUrl?: string;

  @ApiResponseProperty()
  thumbnailUrl?: string;

  @ApiResponseProperty()
  duration?: number;
}
