import { UUID } from '@app/common/types';
import { ApiResponseProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserDto implements Omit<UserEntity, 'createdAt'> {
  @ApiResponseProperty({ format: 'uuid' })
  id: UUID;

  @ApiResponseProperty({ example: 'John Doe' })
  name: string;

  @ApiResponseProperty({
    format: 'uri',
    example: 'https://example.com/avatar.jpg',
  })
  avatar: string;
}
