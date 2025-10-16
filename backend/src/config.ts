import dotenv from "dotenv";

dotenv.config({ quiet: true });

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const nodeEnv = getEnv("NODE_ENV", "development");

const isDevelopment = nodeEnv === "development";

const config = {
  port: Number(getEnv("PORT", "3000")),
  database: {
    host: getEnv("DATABASE_HOST", "localhost"),
    port: Number(getEnv("DATABASE_PORT", "5432")),
    username: getEnv("DATABASE_USER", "postgres"),
    password: getEnv("DATABASE_PASSWORD", ""),
    name: getEnv("DATABASE_NAME", "postgres"),
  },
  session: {
    jwtSecret: getEnv("JWT_SECRET", null),
    jwtRefreshSecret: getEnv("JWT_REFRESH_SECRET", null),
    accessTokenTTL: isDevelopment ? "1h" : "15m",
    refreshTokenTTL: isDevelopment ? "1d" : "3d", // means that you get logged out when you dont use the app in 3 days
  },
  morgan: isDevelopment ? "dev" : "combined",
  isDevelopment,
  nodeEnv,
} as const;

export default config;
