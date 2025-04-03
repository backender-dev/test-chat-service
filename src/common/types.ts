import { IsNumber, IsOptional } from 'class-validator';
import { EMessageType } from './enums/message-type.enum';
import { EWebSocketMessageType } from './enums/web-socket-message-type.enum';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type UUID = string;

export interface BaseMessage {
  id: UUID;
  dialogId: UUID;
  senderId: UUID;
  createdAt: number;
  type: EMessageType;
  delivered: boolean;
}

export interface TextMessage extends BaseMessage {
  type: EMessageType.TEXT;
  content: string;
}

export interface ImageMessage extends BaseMessage {
  type: EMessageType.IMAGE;
  imageUrl: string;
  caption?: string;
}

export interface VideoMessage extends BaseMessage {
  type: EMessageType.VIDEO;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
}

export type Message = TextMessage | ImageMessage | VideoMessage;

export interface WebSocketMessage {
  type: EWebSocketMessageType;
  payload: Message;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
}

export class PageableParams {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;
}

export class Page<T> {
  list: T[];

  @ApiProperty({ description: 'Total elements' })
  total: number;
}
