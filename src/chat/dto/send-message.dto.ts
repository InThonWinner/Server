import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

