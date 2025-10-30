import express, { Router, type Response } from "express";
import z from "zod";

import isAuthenticated, { type UserRequest } from "@middleware/authMiddleware";
import { createPost, getPosts, randomizePostCreatedAt, ratePost } from "@services/posts";
import { validateBody, createZodSchema, type SchemaType } from "@utils/schemaValidator";

import requestLogger from "@middleware/requestLogger";
import createLimiter from "@middleware/rateLimit";
import devOnly from "@middleware/devOnly";

const router = Router();

router.use(express.json());
router.use(requestLogger);

const createPostSchema = createZodSchema("message");
type CreatePostInput = SchemaType<typeof createPostSchema>;
const createPostLimiter = createLimiter(50, 10 * 60_000, true);

const ratePostSchema = createZodSchema("postId", "action");
type RatePostInput = z.infer<typeof ratePostSchema>;
const ratePostLimiter = createLimiter(100, 10 * 60_000, true);

const getPostSchema = createZodSchema("postOffset");
type GetPostInput = z.infer<typeof getPostSchema>;
const getPostsLimiter = createLimiter(200, 5 * 60_000, true);

router.post(
  "/create",
  isAuthenticated(),
  createPostLimiter,
  validateBody(createPostSchema),
  async (req: UserRequest<CreatePostInput>, res: Response) => {
    if (!req.user) return; // typescript safty

    const { message } = req.body;

    const post = await createPost(req.user.id, message);

    console.log(post);

    res.status(200).json({
      success: true,
      id: post.id,
    });
  },
);

router.post(
  "/rate",
  isAuthenticated(),
  ratePostLimiter,
  validateBody(ratePostSchema),
  async (req: UserRequest<RatePostInput>, res) => {
    if (!req.user) return; // typescript safty

    const { postId, action } = req.body;

    const newState = await ratePost(req.user.id, postId, action);

    res.status(200).json({
      success: true,
      newState,
    });
  },
);

router.post(
  "/get",
  isAuthenticated(),
  getPostsLimiter,
  validateBody(getPostSchema),
  async (req: UserRequest<GetPostInput>, res: Response) => {
    if (!req.user) return; // typescript safty

    const { postOffset } = req.body;

    const posts = await getPosts(req.user.id, postOffset);

    res.status(200).json({
      success: true,
      posts,
    });
  },
);

router.post("/randomizePosts", devOnly, async (req, res) => {
  // only in dev
  await randomizePostCreatedAt();
  res.status(200).json({
    success: true,
  });
});

export default router;
