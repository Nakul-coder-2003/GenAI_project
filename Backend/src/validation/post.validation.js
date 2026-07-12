import { z } from "zod";
import { mongoSchema } from "./common.validation.js";

export const getAllPostsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((val) => parseInt(val, 10)),
    limit: z
      .string()
      .optional()
      .default("10")
      .transform((val) => parseInt(val, 10)),
    sort: z.string().optional().default("-createdAt"), // Default: Nayi posts sabse pehle
    mediaType: z.enum(["image", "video"]).optional(), // Sirf image ya video filter karne ke liye
    search: z.string().optional(), // Caption search karne ke liye
  }),
});

export const getUserPostsSchema = z.object({
  params: z.object({
    userId: mongoSchema, // MongoDB ObjectId validation
  }),
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((val) => parseInt(val, 10)),
    limit: z
      .string()
      .optional()
      .default("10")
      .transform((val) => parseInt(val, 10)),
    sort: z.string().optional().default("-createdAt"),
    mediaType: z.enum(["image", "video"]).optional(),
  }),
});

export const likePostSchema = z.object({
  params: z.object({
    postId: mongoSchema,
  }),
});

export const commentPostSchema = z.object({
  params: z.object({
    postId: mongoSchema,
  }),
  body: z.object({
    message: z.string().min(1,"Comment cannot be empty").max(500,"comment too long")
  })
});

export const savedPostSchema = z.object({
  params: z.object({
    postId: mongoSchema,
  }),
});
