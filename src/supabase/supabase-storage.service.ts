// src/supabase/supabase-storage.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private supabaseClient: SupabaseClient;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    // 환경 변수 직접 확인 (디버깅용)
    // console.log('=== 환경 변수 디버깅 ===');
    // console.log('process.env.SUPABASE_URL:', process.env.SUPABASE_URL);
    // console.log('process.env.SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseServiceRoleKey = this.configService.get<string>('supabase.serviceRoleKey');
    this.bucketName = this.configService.get<string>('supabase.bucketName') || 'auth-image';

    // console.log('ConfigService에서 가져온 supabase.url:', supabaseUrl);
    // console.log('ConfigService에서 가져온 supabase.serviceRoleKey:', supabaseServiceRoleKey);
    // console.log('bucketName:', this.bucketName);
    // console.log('======================');

    if (!supabaseUrl || supabaseUrl === '') {
      throw new Error(
        'SUPABASE_URL 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.'
      );
    }

    if (!supabaseServiceRoleKey || supabaseServiceRoleKey === '') {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.'
      );
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    // console.log('supabaseClient:', this.supabaseClient);
  }


  async uploadVerificationImage(
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    try {
      // 파일 확장자 검증
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw new BadRequestException(
          '허용되지 않는 파일 형식입니다. (jpg, jpeg, png, pdf만 가능)',
        );
      }

      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('파일 크기는 5MB를 초과할 수 없습니다.');
      }

      // 고유한 파일명 생성
      const timestamp = Date.now();
      const fileName = `${userId}_${timestamp}.${fileExtension}`;
      const filePath = `verifications/${fileName}`;

      // Supabase Storage에 업로드
      const { data, error } = await this.supabaseClient.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new BadRequestException(`파일 업로드 실패: ${error.message}`);
      }

      // 공개 URL 생성
      const { data: publicUrlData } = this.supabaseClient.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('파일 업로드 중 오류가 발생했습니다.');
    }
  }

  async deleteVerificationImage(imageUrl: string): Promise<void> {
    try {
      // URL에서 파일 경로 추출
      const urlParts = imageUrl.split('/');
      const filePath = urlParts.slice(urlParts.indexOf(this.bucketName) + 1).join('/');

      const { error } = await this.supabaseClient.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('파일 삭제 실패:', error);
      }
    } catch (error) {
      console.error('파일 삭제 중 오류:', error);
    }
  }
}