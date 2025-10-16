import express, { Router } from "express";

import isLoggedIn, { type UserRequest } from "../middleware/authMiddleware";
import { createPost, ratePost } from "../controllers/posts";

const router = Router();

router.use(express.json());

router.post("/create", isLoggedIn(), async (req: UserRequest, res) => {
  const post = await createPost(req.user.id, req.body);

  console.log(post);

  res.status(200).json({
    success: true,
    id: post.id,
  });
});

router.post("/rate", isLoggedIn(), async (req: UserRequest, res) => {
  const newState = await ratePost(req.user.id, req.body);

  res.status(200).json({
    success: true,
    newState,
  });
});

export default router;
