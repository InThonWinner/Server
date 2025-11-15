import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';
import { PostModule } from './post/post.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    UserModule,
    PortfolioModule,
    ChatModule,
    AiModule,
    PostModule,
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
