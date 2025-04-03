import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageableParams, UUID } from '@app/common/types';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':userId/dialogs')
  @ApiOperation({ summary: 'Get user dialogs' })
  async getDialogs(
    @Param('userId', ParseUUIDPipe) userId: UUID,
    @Query() pageable: PageableParams,
  ): Promise<void> {
    //TODO: need to finish it
  }

  @Get(':userId/analytics')
  @ApiOperation({ summary: 'Get user dialogs' })
  async getAnalytics(
    @Param('userId', ParseUUIDPipe) userId: UUID,
  ): Promise<void> {
    //TODO: need to finish it
  }
}
