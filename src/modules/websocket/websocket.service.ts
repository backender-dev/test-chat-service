import { EWebSocketMessageType } from '@app/common/enums/web-socket-message-type.enum';
import { WebSocketMessage } from '@app/common/types';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as WebSocket from 'ws';
import { MessageService } from '../message/message.service';

@Injectable()
export class WebsocketService implements OnModuleInit, OnModuleDestroy {
  private logger: Logger = new Logger(WebsocketService.name);
  private socket: WebSocket;
  private wsUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    this.wsUrl = this.configService.get('EXTERNAL_WS_URL');
  }

  onModuleInit() {
    this.connectToWebSocket();
  }

  onModuleDestroy() {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }

  private connectToWebSocket() {
    this.socket = new WebSocket(this.wsUrl);

    this.socket.on('open', () => {
      this.logger.log(`Connected to WebSocket server at ${this.wsUrl}`);
    });

    this.socket.on('message', (data: string) => {
      void this.handleMessage(data);
    });

    this.socket.on('close', () => {
      this.logger.warn('WebSocket connection closed. Reconnecting in 5s...');
      setTimeout(() => this.connectToWebSocket(), 5000);
    });

    this.socket.on('error', (error) => {
      this.logger.error(`WebSocket connection error: ${error}`);
    });
  }

  private async handleMessage(data: string): Promise<void> {
    try {
      const parsedData: WebSocketMessage = JSON.parse(data);
      if (
        parsedData.type !== EWebSocketMessageType.NEW_MESSAGE ||
        !parsedData.payload
      ) {
        return;
      }

      const message = parsedData.payload;
      await this.messageService.processMessage(message);
    } catch (error) {
      this.logger.error(`Error processing WebSocket message: ${error}`);
    }
  }
}
