import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string()
    .min(32)
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      'string.min': 'JWT_SECRET은 최소 32자 이상이어야 합니다.',
      'any.required': '프로덕션 환경에서는 JWT_SECRET이 필수입니다.',
    }),
  JWT_ACCESS_EXPIRES_IN: Joi.string().optional().default('1d'),
  SUPABASE_URL: Joi.string().uri().required().messages({
    'any.required': 'SUPABASE_URL 환경 변수가 필요합니다.',
    'string.uri': 'SUPABASE_URL은 유효한 URI여야 합니다.',
  }),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required().messages({
    'any.required': 'SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다.',
  }),
  SUPABASE_BUCKET_NAME: Joi.string().optional().default('auth-image'),
  AI_SERVER_URL: Joi.string().uri().optional().default('http://localhost:8000'),
});

export default validationSchema;

