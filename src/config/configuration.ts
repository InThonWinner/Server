export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
  swagger: {
    title: 'NestJS API',
    description: 'NestJS API Documentation',
    version: '1.0',
  },
  jwt: {
    secret:
      process.env.JWT_SECRET ??
      (process.env.NODE_ENV === 'production'
        ? (() => {
            throw new Error(
              'JWT_SECRET 환경 변수가 설정되지 않았습니다. 프로덕션 환경에서는 필수입니다.',
            );
          })()
        : 'development-secret-key-change-in-production'),
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '1d',
  },
  supabase: {
    url: process.env.SUPABASE_URL ?? '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    bucketName: process.env.SUPABASE_BUCKET_NAME ?? 'auth-image',
  },
  ai: {
    serverUrl: process.env.AI_SERVER_URL ?? 'http://localhost:8000',
    geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  },
});

