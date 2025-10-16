import validator from "validator";

import { AppDataSource, Post, PostAction, postRepository } from "../database/datasource";

import HttpError from "../utils/HttpError";
import { PostActionType } from "../database/entities/PostAction";

function validateCreatePostInput(options: { message: string }): {
  message: string;
} {
  if (!options) throw new HttpError("Body is required.", 400);

  const { message } = options;

  if (!message) throw new HttpError("Message is required.", 400);

  const trimmedMessage = message.trim();

  if (!validator.isLength(trimmedMessage, { min: 5, max: 500 }))
    throw new HttpError("Message must be between 5 and 500 characters.", 400);

  return { message: trimmedMessage };
}

function validateRatePostInput(options?: { postId: number; action: PostActionType }): {
  postId: number;
  action: PostActionType;
} {
  if (!options) throw new HttpError("Body is required.", 400);

  const { postId, action } = options;

  const parsedPostId = Number(postId);
  if (isNaN(parsedPostId) || parsedPostId <= 0)
    throw new HttpError("postId must be a positive number.", 400);

  if (action !== PostActionType.BOOST && action !== PostActionType.DISLIKE)
    throw new HttpError("Invalid rate action. Must be 'boost' or 'dislike'.", 400);

  return {
    postId: parsedPostId,
    action,
  };
}

export async function createPost(userId: number, options: { message: string }): Promise<Post> {
  const { message } = validateCreatePostInput(options);

  const post = await postRepository.save({
    user: { id: userId },
    message,
  });

  return post;
}

export async function ratePost(
  userId: number,
  options: {
    postId: number;
    action: PostActionType;
  },
): Promise<PostActionType | null> {
  const { postId, action } = validateRatePostInput(options);

  return await AppDataSource.transaction(async (manager) => {
    const postActionRepo = manager.getRepository(PostAction);
    const postRepo = manager.getRepository(Post);

    const currentPostAction = await postActionRepo.findOne({
      where: { user: { id: userId }, post: { id: postId } },
      select: { id: true, action: true },
    });

    if (currentPostAction?.action === action) {
      await postActionRepo.remove(currentPostAction);
    } else {
      await postActionRepo.upsert(
        {
          user: { id: userId },
          post: { id: postId },
          action,
        },
        { conflictPaths: { post: true, user: true } },
      );
    }

    const post = await postRepo.findOne({
      where: { id: postId },
      lock: { mode: "pessimistic_write" },
    });

    let newAction = null;

    const isCurrentlyDisliked = currentPostAction?.action === PostActionType.DISLIKE;
    const isCurrentlyBoosted = currentPostAction?.action === PostActionType.BOOST;

    if (action === PostActionType.BOOST) {
      if (isCurrentlyBoosted) {
        post.boostCount -= 1;
      } else {
        if (isCurrentlyDisliked) post.dislikeCount -= 1;

        post.boostCount += 1;
        newAction = PostActionType.BOOST;
      }
    }

    if (action === PostActionType.DISLIKE) {
      if (isCurrentlyDisliked) {
        post.dislikeCount -= 1;
      } else {
        if (isCurrentlyBoosted) post.boostCount -= 1;

        post.dislikeCount += 1;
        newAction = PostActionType.DISLIKE;
      }
    }

    await postRepo.save(post);

    return newAction;
  });
}
