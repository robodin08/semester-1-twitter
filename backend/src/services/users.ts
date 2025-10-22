import bcrypt from "bcrypt";

import { userRepository, User } from "@datasource";
import { validateUsername, validatePassword, validateEmail } from "@utils/validators";
import { generateTokens } from "@utils/sessionTokens";

import RequestError from "@RequestError";
import config from "@config";

const bcryptSaltRounds = config.isDevelopment ? 5 : 15;

export async function createUser(
  username: string,
  email: string,
  password: string,
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  validateUsername(username);
  await validatePassword(password);
  await validateEmail(email);

  const emailExists = await userRepository.exists({
    where: { email: email },
  });
  if (emailExists) throw new RequestError("EMAIL_IN_USE");

  const usernameExists = await userRepository.exists({
    where: { username: username },
  });
  if (usernameExists) throw new RequestError("USERNAME_IN_USE");

  const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);

  const user = await userRepository.save({
    username: username,
    email: email,
    password: hashedPassword,
  });

  const { accessToken, refreshToken } = await generateTokens(user.id);

  return { user, accessToken, refreshToken };
}

export async function loginUser(
  identifier: string,
  password: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const user = await userRepository.findOne({
    where: [{ email: identifier }, { username: identifier }],
    select: { id: true, password: true },
  });

  const isMatch = user ? await bcrypt.compare(password.trim(), user.password) : false;

  if (!user || !isMatch) throw new RequestError("INVALID_CREDENTIALS");

  return await generateTokens(user.id);
}
