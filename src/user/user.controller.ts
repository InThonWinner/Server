import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '회원가입이 완료되었습니다.' },
        data: {
          type: 'object',
          properties: {
            userId: { type: 'number', example: 1 },
            email: { type: 'string', example: 'student@korea.ac.kr' },
            nickname: { type: 'string', example: '닉네임' },
            verificationStatus: { type: 'string', example: 'PENDING' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '이미 존재하는 이메일',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: '이미 존재하는 이메일입니다.' },
        error: { type: 'string', example: 'EMAIL_ALREADY_EXISTS' },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.userService.register(registerDto);
    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      data,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '로그인 성공' },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                email: { type: 'string', example: 'student@korea.ac.kr' },
                nickname: { type: 'string', example: '닉네임' },
                realName: { type: 'string', example: '홍길동' },
                role: { type: 'string', example: 'STUDENT' },
                verificationStatus: { type: 'string', example: 'PENDING' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: '이메일 또는 비밀번호가 일치하지 않습니다.',
        },
        error: { type: 'string', example: 'INVALID_CREDENTIALS' },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const data = await this.userService.login(loginDto);
    return {
      success: true,
      message: '로그인 성공',
      data,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '로그아웃되었습니다.' },
      },
    },
  })
  async logout() {
    return {
      success: true,
      message: '로그아웃되었습니다.',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '현재 사용자 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'student@korea.ac.kr' },
            realName: { type: 'string', example: '홍길동' },
            nickname: { type: 'string', example: '닉네임' },
            phone: { type: 'string', example: '010-1234-5678' },
            role: { type: 'string', example: 'STUDENT' },
            studentId: { type: 'string', example: '2022123456' },
            affiliation: { type: 'string', example: 'KU 컴퓨터학과 22' },
            verificationStatus: { type: 'string', example: 'PENDING' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  async getCurrentUser(@Req() req: Request & { user: User }) {
    const userData = await this.userService.getCurrentUser(req.user.id);
    return {
      success: true,
      data: {
        id: userData.id,
        email: userData.email,
        realName: userData.realName,
        nickname: userData.nickname,
        phone: userData.phone,
        role: userData.role,
        studentId: userData.studentId,
        affiliation: userData.affiliation,
        verificationStatus: userData.verificationStatus,
        createdAt: userData.createdAt,
      },
    };
  }
}

