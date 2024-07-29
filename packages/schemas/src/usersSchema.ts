import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { postCore } from "./postsSchema";

const userCore = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string(),
};

const updateUserSchema = z
  .object({
    name: userCore.name.optional(),
    username: z.string().min(1, "Username cannot be empty").optional(),
    description: z.string().optional(),
    profilePicture: z
      .string()
      .base64("profilePicture must be a base64 picture")
      .optional(),
  })
  .refine(
    (data) =>
      data.username !== undefined ||
      data.name !== undefined ||
      data.description !== undefined ||
      data.profilePicture !== undefined,
    {
      message:
        "At least one field (username, description, name or profilePicture) must be provided",
    }
  );

const updateUserResponseSchema = z.object({
  id: z.string(),
  ...userCore,
  password: z.string(),
  username: z.string(),
  description: z.string().optional(),
  profilePicture: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

const createUserSchema = z.object({
  ...userCore,
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, "Password must be at least 8 characters long"),
  username: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a string",
  }),
});

const createUserResponseSchema = z.object({
  id: z.string(),
  ...userCore,
  password: z.string(),
  username: z.string(),
  description: z.string().optional(),
  profilePicture: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string(),
});

const loginResponseSchema = z.object({
  id: z.string(),
  token: z.string(),
});

const getUserByIdParamsSchema = z.object({
  id: z.string(),
});

const getUserByIdQuerySchema = z.object({
  includePosts: z.string().optional(),
});

const getUserByIdResponseSchema = z.object({
  id: z.string(),
  ...userCore,
  password: z.string().optional(),
  username: z.string().optional(),
  description: z.string().optional(),
  profilePicture: z.string().optional(),
  posts: z.array(z.object(postCore)).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type GetUserByIdParamsInput = z.infer<typeof getUserByIdParamsSchema>;

export type GetUserByIdQueryInput = z.infer<typeof getUserByIdQuerySchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
  updateUserResponseSchema,
  updateUserSchema,
  getUserByIdParamsSchema,
  getUserByIdQuerySchema,
  getUserByIdResponseSchema,
}, {
  $id: 'userSchema',
});
