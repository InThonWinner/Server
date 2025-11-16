// src/ai/ai.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiChatRequestDto } from './dto/ai-chat-request.dto';
import { AiChatResponseDto } from './dto/ai-chat-response.dto';
import * as https from 'https';

@Injectable()
export class AiService {
  private readonly aiServerUrl: string;
  private readonly geminiApiKey: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.aiServerUrl = this.configService.get<string>('ai.serverUrl')!;
    this.geminiApiKey = this.configService.get<string>('ai.geminiApiKey') ?? '';
  }

  async chat(question: string): Promise<AiChatResponseDto> {
    console.log('AI Server Request - question:', question);
    console.log('AI Server URL:', this.aiServerUrl);

    try {
      const response = await firstValueFrom(
        this.httpService.post<AiChatResponseDto>(
          `${this.aiServerUrl}/chat`,
          { question }, // FastAPI가 기대하는 형식
          {
            timeout: 30000,
            headers: {
              'Content-Type': 'application/json',
              'Connection': 'keep-alive',
            },
            // SSL 검증 비활성화 (테스트용)
            httpsAgent: new https.Agent({
              rejectUnauthorized: false
            }),
          },
        ),
      );

      console.log('AI Server Response:', response.data);
      return response.data;

    } catch (error: any) {
      console.error('AI Server Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.code === 'ECONNABORTED') {
        throw new HttpException(
          'AI server timeout',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      if (error.response?.status === 422) {
        throw new HttpException(
          error.response?.data?.detail || 'Invalid request format',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      throw new HttpException(
        error.response?.data?.detail || 'AI server is unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async generateTitle(firstMessage: string): Promise<string> {
    if (!this.geminiApiKey) {
      return firstMessage.slice(0, 15);
    }

    try {
      const genAI = new GoogleGenerativeAI(this.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `Generate a short title for the following chat message. Keep the title under 15 characters. Output only the title without any other explanation.\n\nMessage: ${firstMessage}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let title = response.text().trim().replace(/^["']|["']$/g, '');

      return title.length > 0 ? title : firstMessage.slice(0, 15);
    } catch (error: any) {
      console.error('Gemini API Error:', {
        message: error?.message,
        code: error?.code,
        status: error?.status,
      });
      return firstMessage.slice(0, 15);
    }
  }
}