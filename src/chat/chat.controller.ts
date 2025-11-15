import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '새 채팅 세션 생성' })
  @ApiResponse({
    status: 201,
    description: '세션 생성 성공',
  })
  createSession(@Req() req: Request & { user: User }) {
    return this.chatService.createSession(req.user.id);
  }

  @Get('sessions')
  @ApiOperation({ summary: '사용자의 채팅 세션 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '세션 목록 조회 성공',
  })
  getUserSessions(@Req() req: Request & { user: User }) {
    return this.chatService.findUserSessions(req.user.id);
  }

  @Get('sessions/:sessionId')
  @ApiOperation({ summary: '특정 세션 조회' })
  @ApiResponse({
    status: 200,
    description: '세션 조회 성공',
  })
  @ApiResponse({
    status: 404,
    description: '세션을 찾을 수 없음',
  })
  @ApiResponse({
    status: 403,
    description: '접근 권한 없음',
  })
  getSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Req() req: Request & { user: User },
  ) {
    return this.chatService.findSession(sessionId, req.user.id);
  }

  @Get('sessions/:sessionId/messages')
  @ApiOperation({ summary: '특정 세션의 메시지 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '메시지 목록 조회 성공',
  })
  getMessages(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Req() req: Request & { user: User },
  ) {
    return this.chatService.getMessages(sessionId, req.user.id);
  }

  @Post('sessions/:sessionId/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '메시지 전송' })
  @ApiResponse({
    status: 201,
    description: '메시지 전송 성공',
  })
  sendMessage(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Req() req: Request & { user: User },
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(sessionId, req.user.id, dto);
  }


  @Delete('sessions/:sessionId')
  @ApiOperation({ summary: '세션 삭제' })
  @ApiResponse({
    status: 200,
    description: '세션 삭제 성공',
  })
  deleteSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Req() req: Request & { user: User },
  ) {
    return this.chatService.deleteSession(sessionId, req.user.id);
  }
}

