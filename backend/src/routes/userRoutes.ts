import express, { Router } from "express";

import { createUser, loginUser } from "@services/users";
import isAuthenticated, { type UserRequest } from "@middleware/authMiddleware";
import { revokeRefreshToken, refreshAccessToken } from "@utils/sessionTokens";
import { validateBody, createZodSchema, type SchemaType } from "@utils/schemaValidator";
import requestLogger from "@middleware/requestLogger";
import createLimiter from "@middleware/rateLimit";

const router = Router();

router.use(express.json());
router.use(requestLogger);

const createUserScheme = createZodSchema("username", "email", "password");
type CreateUserInput = SchemaType<typeof createUserScheme>;
const createUserLimiter = createLimiter(5, 10 * 60_000);

const loginUserScheme = createZodSchema("identifier", "password");
type LoginUserInput = SchemaType<typeof loginUserScheme>;
const loginLimiter = createLimiter(10, 10 * 60_000);

const refreshUserScheme = createZodSchema("refreshToken");
type RefreshUserInput = SchemaType<typeof refreshUserScheme>;
const refreshLimiter = createLimiter(60, 5 * 60_000, true);

const logoutUserScheme = createZodSchema("refreshToken");
type LogoutUserInput = SchemaType<typeof logoutUserScheme>;
const logoutLimiter = createLimiter(100, 15 * 60_000, true);

const infoLimiter = createLimiter(200, 10 * 60_000, true);

router.post(
  "/create",
  createUserLimiter,
  validateBody(createUserScheme),
  async (req: UserRequest<CreateUserInput>, res) => {
    const { username, email, password } = req.body;

    await createUser(username, email, password);

    res.status(200).json({
      success: true,
    });
  },
);

router.post("/login", loginLimiter, validateBody(loginUserScheme), async (req: UserRequest<LoginUserInput>, res) => {
  const { identifier, password } = req.body;

  const { accessToken, refreshToken } = await loginUser(identifier, password);

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
  });
});

router.post(
  "/refresh",
  refreshLimiter,
  validateBody(refreshUserScheme),
  async (req: UserRequest<RefreshUserInput>, res) => {
    const { refreshToken } = req.body;

    const accessToken = await refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
    });
  },
);

router.post(
  "/logout",
  isAuthenticated(),
  logoutLimiter,
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
  infoLimiter,
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
