import express, { Router, type Response } from "express";
import z from "zod";

import isAuthenticated, { type UserRequest } from "@middleware/authMiddleware";
import { createPost, ratePost } from "@services/posts";
import { validateBody, createZodSchema, type SchemaType } from "@utils/schemaValidator";
import requestLogger from "@middleware/requestLogger";

const router = Router();

router.use(express.json());

router.use(requestLogger);

const createPostSchema = createZodSchema("message");
type CreatePostInput = SchemaType<typeof createPostSchema>;

router.post(
  "/create",
  isAuthenticated(),
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

const ratePostSchema = createZodSchema("postId", "action");
type RatePostInput = z.infer<typeof ratePostSchema>;

router.post("/rate", isAuthenticated(), validateBody(ratePostSchema), async (req: UserRequest<RatePostInput>, res) => {
  if (!req.user) return; // typescript safty

  const { postId, action } = req.body;

  const newState = await ratePost(req.user.id, postId, action);

  res.status(200).json({
    success: true,
    newState,
  });
});

export default router;
