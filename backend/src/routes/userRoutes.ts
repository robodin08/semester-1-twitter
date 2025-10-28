import express, { Router } from "express";

import { createUser, loginUser } from "@services/users";
import isAuthenticated, { type UserRequest } from "@middleware/authMiddleware";
import { revokeRefreshToken, refreshAccessToken } from "@utils/sessionTokens";
import { validateBody, createZodSchema, type SchemaType } from "@utils/schemaValidator";
import requestLogger from "@middleware/requestLogger";

const router = Router();

router.use(express.json());

router.use(requestLogger);

const createUserScheme = createZodSchema("username", "email", "password");
type CreateUserInput = SchemaType<typeof createUserScheme>;

router.post("/create", validateBody(createUserScheme), async (req: UserRequest<CreateUserInput>, res) => {
  const { username, email, password } = req.body;

  const user = await createUser(username, email, password);

  res.status(200).json({
    success: true,
  });
});

const loginUserScheme = createZodSchema("identifier", "password");
type LoginUserInput = SchemaType<typeof loginUserScheme>;

router.post("/login", validateBody(loginUserScheme), async (req: UserRequest<LoginUserInput>, res) => {
  const { identifier, password } = req.body;

  const { accessToken, refreshToken } = await loginUser(identifier, password);

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
  });
});

const refreshUserScheme = createZodSchema("refreshToken");
type RefreshUserInput = SchemaType<typeof refreshUserScheme>;

router.post("/refresh", validateBody(refreshUserScheme), async (req: UserRequest<RefreshUserInput>, res) => {
  const { refreshToken } = req.body;

  const accessToken = await refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    accessToken,
  });
});

const logoutUserScheme = createZodSchema("refreshToken");
type LogoutUserInput = SchemaType<typeof logoutUserScheme>;

router.post(
  "/logout",
  isAuthenticated(),
  validateBody(logoutUserScheme),
  async (req: UserRequest<LogoutUserInput>, res) => {
    if (!req.user) return; // typescript safty

    const { refreshToken } = req.body;

    await revokeRefreshToken(req.user.id, refreshToken);

    res.status(200).json({
      success: true,
    });
  },
);

router.post(
  "/info",
  isAuthenticated({ select: { id: true, email: true, username: true } }),
  async (req: UserRequest, res) => {
    console.log(req.user);

    res.status(200).json({
      success: true,
      user: req.user,
    });
  },
);

// get boosted posts

export default router;
