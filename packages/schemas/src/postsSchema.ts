import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

export const postCore = {
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email(),
    name: z.string(),
  };