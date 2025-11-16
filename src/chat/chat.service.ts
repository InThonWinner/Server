import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageRole } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  // 새 세션 생성
  async createSession(userId: number) {
    return this.prisma.chatSession.create({
      data: { userId },
    });
  }

  // 사용자의 세션 목록 조회
  async findUserSessions(userId: number) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // 특정 세션 조회
  async findSession(sessionId: number, userId: number) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return session;
  }

  // 세션의 메시지 목록만 조회
  async getMessages(sessionId: number, userId: number) {
    // 권한 확인
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  // 메시지 전송 (핵심 기능)
  async sendMessage(sessionId: number, userId: number, dto: SendMessageDto) {
    // 1. 세션 확인 및 권한 체크
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  
    if (!session) {
      throw new NotFoundException('Session not found');
    }
  
    if (session.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
  
    // 2. 첫 메시지인지 확인하고 제목 생성
    const isFirstMessage = session.messages.length === 0;
    if (isFirstMessage && !session.title) {
      this.aiService
        .generateTitle(dto.content)
        .then((title) => {
          return this.prisma.chatSession.update({
            where: { id: sessionId },
            data: { title },
          });
        })
        .catch((error) => {
          console.error('Failed to generate title:', error);
          return this.prisma.chatSession.update({
            where: { id: sessionId },
            data: { title: dto.content.slice(0, 15) },
          });
        });
    }
  
    // 3. 사용자 메시지 저장
    const userMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: MessageRole.USER,
        content: dto.content,
      },
    });
  
    // 4. AI 서버에 질문만 전송 (FastAPI는 RAG로 컨텍스트 관리)
    const aiResponse = await this.aiService.chat(dto.content);
  
    // 5. AI 응답 저장
    const assistantMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: MessageRole.ASSISTANT,
        content: aiResponse.answer,
      },
    });
  
    // 6. 세션 업데이트
    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });
  
    // 7. AI 응답만 반환 (사용자 메시지는 프론트엔드에서 이미 표시됨)
    return {
      assistantMessage,
      sources: aiResponse.sources, // RAG 출처 정보도 함께 반환
    };
  }  

  // 세션 삭제
  async deleteSession(sessionId: number, userId: number) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.chatSession.delete({
      where: { id: sessionId },
    });

    return { success: true };
  }
}

