import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

export const postCore = {
  id: z.string(),
  title: z.string(),
  content: z.string(),
  published: z.boolean().optional(),
  authorId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
};

const updatePostSchema = z
  .object({
    title: postCore.title.optional(),
    content: z.string().optional()
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.content !== undefined,
    {
      message:
        "At least one field (title, content) must be provided",
    }
  );

const updatePostResponseSchema = z.object({
  id: postCore.id,
  title: postCore.title,
  content: postCore.content,
  published: postCore.published,
  authorId: postCore.authorId,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

const createPostSchema = z.object({
  title: postCore.title,
  content: postCore.content,
});

export const createPostResponseSchema = z.object({
  id: postCore.id,
  title: postCore.title,
  content: postCore.content,
  published: postCore.published,
  authorId: postCore.authorId,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

const getPostByIdSchema = z.object({
  id: z.string(),
});

const getPostByIdResponseSchema = z.object({
  id: postCore.id,
  title: postCore.title,
  content: postCore.content,
  published: postCore.published,
  authorId: postCore.authorId,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export const deletePostResponseSchema = z.object({
  message: z.string(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export type GetPostByIdInput = z.infer<typeof getPostByIdSchema>;

export type GetPostResponse = z.infer<typeof getPostByIdResponseSchema>;

export type DeletePostResponse = z.infer<typeof deletePostResponseSchema>;


export const { schemas: postSchemas, $ref } = buildJsonSchemas({
  deletePostResponseSchema,
  createPostSchema,
  createPostResponseSchema,
  updatePostResponseSchema,
  updatePostSchema,
  getPostByIdSchema,
  getPostByIdResponseSchema,
}, {
  $id: 'postSchema',
});

