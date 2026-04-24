import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  age: z.number().min(1, "Age must be greater than 0"),
  age: z.coerce.number().min(1),
});
