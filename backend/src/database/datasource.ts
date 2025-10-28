import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "@entities/User";
import { Session } from "@entities/Session";
import { Post } from "@entities/Post";
import { PostAction } from "@entities/PostAction";
import { RequestLog } from "@entities/RequestLog";

import config from "@config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  entities: [User, Session, Post, PostAction, RequestLog],
  synchronize: config.isDevelopment,
});

export async function initializeAppDataSource() {
  await AppDataSource.initialize();
  console.log("App Data Source has been initialized!");
}

export const userRepository = AppDataSource.getRepository(User);
export const sessionRepository = AppDataSource.getRepository(Session);
export const postRepository = AppDataSource.getRepository(Post);
export const postActionRepository = AppDataSource.getRepository(PostAction);
export const requestLogRepository = AppDataSource.getRepository(RequestLog);

export { User, Session, Post, PostAction, RequestLog };
