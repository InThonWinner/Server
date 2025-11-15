import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { AiChatRequestDto } from './dto/ai-chat-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'AI 서버와 대화' })
  @ApiResponse({
    status: 200,
    description: 'AI 응답 성공',
    schema: {
      type: 'object',
      properties: {
        answer: { type: 'string', example: 'AI 응답 내용' },
        sources: { type: 'object', nullable: true },
      },
    },
  })
  @ApiResponse({
    status: 504,
    description: 'AI 서버 타임아웃',
  })
  @ApiResponse({
    status: 503,
    description: 'AI 서버 사용 불가',
  })
  async chat(
    @Req() req: Request & { user: User },
    @Body() dto: AiChatRequestDto,
  ) {
    // 사용자 ID를 자동으로 설정
    const request: AiChatRequestDto = {
      ...dto,
      user_id: req.user.id,
    };

    return this.aiService.chat(request);
  }
}

