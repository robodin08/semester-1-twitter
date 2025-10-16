import bcrypt from "bcrypt";

import { userRepository, User } from "../database/datasource";
import { validateCreateUserInput, validateLoginUserInput } from "../utils/validators";
import { generateTokens } from "../utils/sessionTokens";

import config from "../config.ts";
import HttpError from "../utils/HttpError";

const bcryptSaltRounds = config.isDevelopment ? 5 : 15;

export async function createUser(options: {
  username: string;
  email: string;
  password: string;
}): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const { username, email, password } = await validateCreateUserInput(options);

  const emailExists = await userRepository.exists({
    where: { email: email },
  });
  if (emailExists) throw new HttpError("Email already in use.", 409);

  const usernameExists = await userRepository.exists({
    where: { username: username },
  });
  if (usernameExists) throw new HttpError("Username already in use.", 409);

  const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);

  const user = await userRepository.save({
    username: username,
    email: email,
    password: hashedPassword,
  });

  const { accessToken, refreshToken } = await generateTokens(user.id);

  return { user, accessToken, refreshToken };
}

export async function loginUser(options: {
  password: string;
  identifier: string;
}): Promise<{ accessToken: string; refreshToken: string }> {
  const { type, identifier: identifier, password } = await validateLoginUserInput(options);

  const user = await userRepository.findOne({
    where: type === "email" ? { email: identifier } : { username: identifier },
    select: { id: true, password: true },
  });

  if (!user) throw new HttpError("User does not exist.", 404);

  const isMatch = await bcrypt.compare(password.trim(), user.password);
  if (!isMatch) throw new HttpError("Invalid password entered.", 401);

  return await generateTokens(user.id);
}
