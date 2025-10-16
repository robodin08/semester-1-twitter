import express, { Router } from "express";

import { createUser, loginUser } from "../controllers/users";
import isLoggedIn, { type UserRequest } from "../middleware/authMiddleware";
import { revokeRefreshToken, refreshAccessToken } from "../utils/sessionTokens";
import HttpError from "../utils/HttpError";

const router = Router();

router.use(express.json());

router.post("/create", async (req, res) => {
  const user = await createUser(req.body);

  console.log(user);

  res.status(200).json({
    success: true,
  });
});

router.post("/login", async (req, res) => {
  const { accessToken, refreshToken } = await loginUser(req.body);

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
  });
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) throw new HttpError("Empty input fields.", 400);

  const accessToken = await refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    accessToken,
  });
});

router.post("/logout", isLoggedIn(), async (req: UserRequest, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) throw new HttpError("Empty input fields.", 400);

  await revokeRefreshToken(req.user.id, refreshToken);

  res.status(200).json({
    success: true,
  });
});

router.post(
  "/info",
  isLoggedIn({ select: { id: true, email: true, username: true } }),
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
