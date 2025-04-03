import { MessageDto } from '../dto/message.dto';
import { MessageEntity } from '../entities/message.entity';

export function MessageEntityToMessageDto(entity: MessageEntity): MessageDto {
  const {
    id,
    type,
    sender,
    status,
    updatedAt,
    content,
    imageUrl,
    caption,
    videoUrl,
    thumbnailUrl,
    duration,
  } = entity;

  return {
    status,
    updatedAt,
    senderInfo: sender && {
      id: sender.id,
      name: sender.name,
      avatar: sender.avatar,
    },
    content: {
      id,
      type,
      content,
      imageUrl,
      caption,
      videoUrl,
      thumbnailUrl,
      duration,
    },
  };
}
