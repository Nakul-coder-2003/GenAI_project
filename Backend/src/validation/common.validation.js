import { z } from "zod";
export const mongoSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

