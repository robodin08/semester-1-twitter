import z from "zod";

import { PostActionType } from "../database/entities/PostAction";
import type { NextFunction, Request, Response } from "express";

const fieldValidators = {
  username: z.string().trim().nonempty(),
  email: z.email().trim(),
  password: z.string().trim().nonempty(),
  identifier: z.string().trim().nonempty(),
  refreshToken: z.string().trim().nonempty(),
  message: z.string().trim().nonempty(),
  postId: z.int().min(0),
  action: z.enum(Object.values(PostActionType)),
};

export type SchemaType<T extends ReturnType<typeof createZodSchema>> = T extends z.ZodTypeAny
  ? z.infer<T>
  : never;

export function createZodSchema<T extends readonly (keyof typeof fieldValidators)[]>(...fields: T) {
  const schema = z.object(
    Object.fromEntries(fields.map((f) => [f, fieldValidators[f]])) as {
      [K in T[number]]: (typeof fieldValidators)[K];
    },
  );
  return schema;
}

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}
