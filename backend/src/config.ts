import dotenv from "dotenv";
import ms from "ms";

dotenv.config();

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];

  if (fallback !== undefined) {
    return value ?? fallback;
  } else if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

const nodeEnv = getEnv("NODE_ENV", "development");
const isDevelopment = nodeEnv === "development";

function ttl(value: string): ms.StringValue {
  return value as ms.StringValue;
}

const config = {
  port: Number(getEnv("PORT", "3000")),
  database: {
    host: getEnv("DATABASE_HOST", "localhost"),
    port: Number(getEnv("DATABASE_PORT", "5432")),
    username: getEnv("DATABASE_USER", "postgres"),
    password: getEnv("DATABASE_PASSWORD"),
    name: getEnv("DATABASE_NAME", "postgres"),
  },
  session: {
    jwtSecret: getEnv("JWT_SECRET"),
    jwtRefreshSecret: getEnv("JWT_REFRESH_SECRET"),
    accessTokenTTL: ttl(isDevelopment ? "5m" : "15m"),
    refreshTokenTTL: ttl(isDevelopment ? "30d" : "30d"),
  },
  morgan: isDevelopment ? "dev" : "combined",
  isDevelopment,
  nodeEnv,
} as const;

export default config;
