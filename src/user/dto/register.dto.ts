import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    description: '이메일 주소',
    example: 'student@korea.ac.kr',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: '실명',
    example: '홍길동',
  })
  @IsString()
  realName: string;

  @ApiProperty({
    description: '닉네임',
    example: '닉네임',
  })
  @IsString()
  nickname: string;

  @ApiPropertyOptional({
    description: '전화번호',
    example: '010-1234-5678',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: '학번 (재학생일 경우)',
    example: '2022123456',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: '소속',
    example: 'KU 컴퓨터학과 22',
  })
  @IsOptional()
  @IsString()
  affiliation?: string;

  @ApiProperty({
    description: '사용자 역할',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  @IsEnum(UserRole, { message: '올바른 역할을 선택해주세요.' })
  role: UserRole;
}

