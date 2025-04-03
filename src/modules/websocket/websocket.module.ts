import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [MessageModule],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
