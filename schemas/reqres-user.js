import { z } from 'zod';

export const CreateUserResponse = z.object({
  first_name: z.string(),
  email: z.string(),
  id: z.string(),          
  createdAt: z.string()   
});

export const UpdateUserResponse = z.object({
  first_name: z.string().optional(),
  email: z.string().optional(),
  updatedAt: z.string()
});

export const ListUsersResponse = z.object({
  page: z.number(),
  per_page: z.number(),
  total: z.number(),
  total_pages: z.number(),
  data: z.array(z.object({
    id: z.number(),
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    avatar: z.string()
  }))
});
