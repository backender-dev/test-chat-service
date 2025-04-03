import { EMessageStatus } from '@app/common/enums/message-status.enum';
import { UserDto } from '@app/modules/user/dto/user.dto';
import { ApiResponseProperty } from '@nestjs/swagger';
import { ContentDto } from './content.dto';

export class MessageDto {
  @ApiResponseProperty({ enum: EMessageStatus })
  status: EMessageStatus;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  content: ContentDto;

  @ApiResponseProperty()
  senderInfo: UserDto;
}
