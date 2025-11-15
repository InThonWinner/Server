import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { User, VerificationStatus } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async register(registerDto: RegisterDto) {
    // 이메일 중복 확인
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해싱
    const passwordHash = await this.authService.hashPassword(
      registerDto.password,
    );

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        passwordHash,
        realName: registerDto.realName,
        nickname: registerDto.nickname,
        phone: registerDto.phone,
        studentId: registerDto.studentId,
        affiliation: registerDto.affiliation,
        role: registerDto.role,
        verificationStatus: VerificationStatus.PENDING,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        verificationStatus: true,
      },
    });

    return {
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
      verificationStatus: user.verificationStatus,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const isPasswordValid = await this.authService.comparePassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const accessToken = await this.authService.generateToken(user);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        realName: user.realName,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    };
  }

  async getCurrentUser(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}

