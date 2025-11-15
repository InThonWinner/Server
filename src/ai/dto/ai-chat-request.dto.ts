import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsNotEmpty } from 'class-validator';

export class MessageHistoryDto {
  @ApiProperty({ example: 'user', description: '메시지 역할' })
  @IsString()
  role: string;

  @ApiProperty({ example: '안녕하세요', description: '메시지 내용' })
  @IsString()
  content: string;
}

export class AiChatRequestDto {
  @ApiProperty({ example: '안녕하세요', description: '질문' })
  @IsString()
  @IsNotEmpty()
  question: string;
}

// export class AiChatRequestDto {
//   @ApiProperty({ example: 1, description: '세션 ID' })
//   @IsNumber()
//   session_id: number;

//   @ApiProperty({ example: 1, description: '사용자 ID (자동 설정됨)', required: false })
//   user_id?: number;

//   @ApiProperty({ example: '안녕하세요', description: '사용자 메시지' })
//   @IsString()
//   @IsNotEmpty()
//   message: string;

//   @ApiProperty({
//     type: [MessageHistoryDto],
//     example: [
//       { role: 'user', content: '안녕하세요' },
//       { role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요?' },
//     ],
//     description: '대화 히스토리',
//   })
//   @IsArray()
//   history: MessageHistoryDto[];
// }

