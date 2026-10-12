import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateItemRequest {
  @ApiProperty({ example: 'Coffee' })
  @IsString()
  name: string;
}
