import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AiChatRequestDto } from './dto/ai-chat-request.dto';
import { AiChatResponseDto } from './dto/ai-chat-response.dto';

@Injectable()
export class AiService {
  private readonly aiServerUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.aiServerUrl = this.configService.get<string>('ai.serverUrl')!;
  }

  async chat(request: AiChatRequestDto): Promise<AiChatResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<AiChatResponseDto>(
          `${this.aiServerUrl}/chat`,
          request,
          { timeout: 30000 },
        ),
      );

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
}

