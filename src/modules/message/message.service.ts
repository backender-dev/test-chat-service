import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';
import { messageSchema } from './message.shema';
import { Message, Page, PageableParams, UUID } from '@app/common/types';
import { UserService } from '../user/user.service';
import { Transactional } from 'typeorm-transactional';
import { UserEntity } from '../user/entities/user.entity';
import { EMessageStatus } from '@app/common/enums/message-status.enum';
import { MessageDto } from './dto/message.dto';
import { MessageEntityToMessageDto } from './mapper/message.mapper';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly userService: UserService,
  ) {}

  private validateMessage(message: Message): string {
    const { error } = messageSchema.validate(message, { abortEarly: false });
    if (error) {
      return error.details.map((detail) => detail.message).join(', ');
    }
    return;
  }

  @Transactional() // ensure atomicity of message processing
  async processMessage(message: Message): Promise<void> {
    const validationErrors = this.validateMessage(message); // message consistency validation
    if (validationErrors) {
      this.logger.error(
        `${validationErrors} in message: ${JSON.stringify(message)}`,
      );
      return;
    }

    const { id, senderId, createdAt } = message;

    const sender = await this.userService.createUserIfNeeded(senderId);
    if (!sender) {
      this.logger.error(`User ${senderId} not found`);
      return;
    }

    const existingMessage = await this.messageRepository.findOne({
      where: { id, status: EMessageStatus.DELIVERED },
    });
    // save only new and undelivered messages
    if (existingMessage) {
      this.logger.warn(`Duplicate message detected: ${id}`);
      return;
    }

    const lastMessage = await this.messageRepository.findOne({
      where: { sender: sender },
      order: { createdAt: 'DESC' },
    });
    // ensure correct message order
    if (lastMessage && new Date(lastMessage.createdAt) > new Date(createdAt)) {
      this.logger.warn(
        `Out-of-order message received (ID: ${id}), holding for reordering`,
      );
      // save it in a temporary queue or buffer (and handle it)
      return;
    }

    await this.storeMessage(message, sender); //store all valid messages in the database
  }

  private async storeMessage(
    message: Message,
    sender: UserEntity,
  ): Promise<void> {
    try {
      const { createdAt, delivered } = message;
      const messageEntity = this.messageRepository.create({
        ...message,
        sender,
        createdAt: new Date(createdAt),
        updatedAt: new Date(createdAt),
        status: delivered ? EMessageStatus.DELIVERED : EMessageStatus.SENT,
      });

      await this.messageRepository.save(messageEntity);
    } catch (error) {
      this.logger.error(
        `Error storing message ${message.id}: ${error.message}`,
      );
      return;
    }
  }

  async getMessagesByDialogId(
    dialogId: UUID,
    pageable: PageableParams,
  ): Promise<Page<MessageDto>> {
    const { offset, limit } = pageable;
    const [results, total] = await this.messageRepository.findAndCount({
      where: { dialogId },
      relations: ['sender'],
      order: { updatedAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    return { total, list: results.map(MessageEntityToMessageDto) };
  }
}
