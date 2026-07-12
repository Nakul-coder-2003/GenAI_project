import { z } from "zod";

// 1. Get Profile Schema (URL mein /:userName aata hai, yaani params check honge)
export const getProfileSchema = z.object({
  params: z.object({
    userName: z.string().min(3, "Username must be at least 3 characters").max(30, "Username too long")
  })
});

// 2. Search Users Schema (URL mein ?q=nakul aata hai, yaani query check hogi)
export const searchUsersSchema = z.object({
  query: z.object({
    q: z.string().min(1, "Search query cannot be empty") // Kam se kam 1 character type karna zaroori hai
  })
});