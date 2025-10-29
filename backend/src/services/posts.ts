import { In } from "typeorm";

import { validateMessage } from "@utils/validators";

import { AppDataSource, Post, PostAction, postActionRepository, postRepository } from "@datasource";
import { PostActionType } from "@entities/PostAction";

export async function createPost(userId: number, message: string): Promise<Post> {
  validateMessage(message);

  const post = await postRepository.save({
    user: { id: userId },
    message,
  });

  return post;
}

export async function ratePost(userId: number, postId: number, action: PostActionType): Promise<PostActionType | null> {
  const postActionRepo = AppDataSource.getRepository(PostAction);
  const postRepo = AppDataSource.getRepository(Post);

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

  let newAction: PostActionType | null = null;

  const isCurrentlyDisliked = currentPostAction?.action === PostActionType.DISLIKE;
  const isCurrentlyBoosted = currentPostAction?.action === PostActionType.BOOST;

  if (action === PostActionType.BOOST) {
    if (isCurrentlyBoosted) {
      await postRepo.increment({ id: postId }, "boostCount", -1);
    } else {
      if (isCurrentlyDisliked) await postRepo.increment({ id: postId }, "dislikeCount", -1);
      await postRepo.increment({ id: postId }, "boostCount", 1);
      newAction = PostActionType.BOOST;
    }
  }

  if (action === PostActionType.DISLIKE) {
    if (isCurrentlyDisliked) {
      await postRepo.increment({ id: postId }, "dislikeCount", -1);
    } else {
      if (isCurrentlyBoosted) await postRepo.increment({ id: postId }, "boostCount", -1);
      await postRepo.increment({ id: postId }, "dislikeCount", 1);
      newAction = PostActionType.DISLIKE;
    }
  }

  return newAction;
}

export async function getPosts(userId: number, offset = 0, limit = 10) {
  const hotScoreExpr = `
  (post.boostCount - post.dislikeCount) /
  POW(EXTRACT(EPOCH FROM (NOW() - post.createdAt)) / 3600 + 2, 1.5)
`;

  const posts = await postRepository
    .createQueryBuilder("post")
    .addSelect(hotScoreExpr, "hotScore")
    .where(
      `
    post.createdAt + INTERVAL '1 day' + (post.boostCount * INTERVAL '15 minutes') > NOW()
  `,
    )
    .orderBy(hotScoreExpr, "DESC")
    .addOrderBy("post.createdAt", "DESC")
    .offset(offset * limit)
    .limit(limit)
    .getMany();

  const postIds = posts.map((p) => p.id);
  const postActions = await postActionRepository.find({
    where: {
      user: { id: userId },
      post: { id: In(postIds) },
    },
    select: {
      post: { id: true },
      action: true,
    },
    relations: ["post"],
  });

  const actionMap = new Map(postActions.map((a) => [a.post?.id, a.action]));

  const newPosts = posts.map((post) => ({
    id: post.id,
    message: post.message,
    boostCount: post.boostCount,
    createdAt: post.createdAt,
    userAction: actionMap.get(post.id) ?? null,
  }));

  return newPosts;
}

export async function randomizePostCreatedAt() {
  function randomDateWithinLast2Hours(): Date {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const randomTime = twoHoursAgo.getTime() + Math.random() * (now.getTime() - twoHoursAgo.getTime());
    return new Date(randomTime);
  }

  const posts = await postRepository.find();

  for (const post of posts) {
    post.createdAt = randomDateWithinLast2Hours();
    await postRepository.save(post);
  }
}
