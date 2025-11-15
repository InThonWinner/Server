import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiChatRequestDto } from './dto/ai-chat-request.dto';
import { AiChatResponseDto } from './dto/ai-chat-response.dto';

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

  async chat(request: AiChatRequestDto): Promise<AiChatResponseDto> {
    console.log('request:', request);
    try {
      const response = await firstValueFrom(
        this.httpService.post<AiChatResponseDto>(
          `${this.aiServerUrl}/chat`,
          request,
          { timeout: 30000 },
        ),
      );

      console.log('response:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('AI Server Error:', error);

      if (error.code === 'ECONNABORTED') {
        throw new HttpException(
          'AI server timeout',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      throw new HttpException(
        'AI server is unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async generateTitle(firstMessage: string): Promise<string> {
    // Fallback: return first 15 characters if Gemini API key is not configured
    if (!this.geminiApiKey) {
      return firstMessage.slice(0, 15);
    }

    try {
      const genAI = new GoogleGenerativeAI(this.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Generate a short title for the following chat message. Keep the title under 15 characters. Output only the title without any other explanation.\n\nMessage:${firstMessage}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let title = response.text().trim();

      // Remove any quotes if present
      title = title.replace(/^["']|["']$/g, '');

      // If title is empty or too short, use fallback
      if (title.length === 0) {
        return firstMessage.slice(0, 15);
      }

      return title;
    } catch (error: any) {
      // console.error('Gemini API Error:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        status: error?.status,
      });
      // Fallback to first 15 characters of the message
      return firstMessage.slice(0, 15);
    }
  }
}

