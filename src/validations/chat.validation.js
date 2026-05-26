import { z } from "zod";

export const createChannelSchema = z.object({
  name: z.string().trim().min(2, "Channel name must be at least 2 characters"),
  description: z.string().trim().max(280, "Description is too long").optional().default(""),
  isPrivate: z.coerce.boolean().optional().default(false),
  createdBy: z.string().min(1, "createdBy is required"),
});

export const joinChannelSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const sendMessageSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  content: z.string().trim().min(1, "Message content is required").max(4000, "Message is too long"),
});

export const updateMessageSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  content: z.string().trim().min(1, "Message content is required").max(4000, "Message is too long"),
});

export const deleteMessageSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});
