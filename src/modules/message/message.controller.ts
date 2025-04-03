import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { Page, PageableParams, UUID } from '@app/common/types';
import { ApiOkResponsePaginated } from '@app/common/decorators/paged-response.decorator';
import { MessageDto } from './dto/message.dto';

@ApiTags('Dialogs')
@Controller('dialogs')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':dialogId/messages')
  @ApiOperation({ summary: 'Get dialog messages' })
  @ApiOkResponsePaginated(MessageDto)
  async getMessages(
    @Param('dialogId', ParseUUIDPipe) dialogId: UUID,
    @Query() pageable: PageableParams,
  ): Promise<Page<MessageDto>> {
    return this.messageService.getMessagesByDialogId(dialogId, pageable);
  }
}
