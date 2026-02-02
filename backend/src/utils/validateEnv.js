// Environment Variables Validation

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'CORS_ORIGIN',
  'NODE_ENV',
  'PORT',
];

export const validateEnv = () => {
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  if (!process.env.DATABASE_URL?.startsWith('mongodb')) {
    throw new Error('DATABASE_URL must be a valid MongoDB connection string');
  }

  if (process.env.JWT_SECRET === 'dev_secret_key_not_for_production' && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ WARNING: Using default JWT_SECRET in production.');
  }

  console.log('✅ Environment variables validated');
};
