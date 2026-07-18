import { z } from 'zod';

export const createShareLinkSchema = z.object({
  expiresAt: z.string().datetime().optional().nullable(),
});

export type CreateShareLinkInput = z.infer<typeof createShareLinkSchema>;
