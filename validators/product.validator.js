import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.coerce.number().positive('Price must be greater than 0'),
  category: z.enum(['textbook', 'electronics', 'clothing', 'services', 'other']),
  university: z.string().min(2),
});