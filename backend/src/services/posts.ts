import validator from "validator";

import { AppDataSource, Post, PostAction, postRepository } from "../database/datasource";

import RequestError from "../utils/RequestError";
import { PostActionType } from "../database/entities/PostAction";

export async function createPost(userId: number, message: string): Promise<Post> {
  if (!validator.isLength(message, { min: 5, max: 500 }))
    throw new RequestError("INVALID_MESSAGE_LENGTH");

  const post = await postRepository.save({
    user: { id: userId },
    message,
  });

  return post;
}

export async function ratePost(
  userId: number,
  postId: number,
  action: PostActionType,
): Promise<PostActionType | null> {
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
