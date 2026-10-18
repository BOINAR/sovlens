import { z } from 'zod';

export const updateStorageConfigSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('cloud'),
  }),
  z.object({
    mode: z.literal('sovereign'),
    endpoint: z.url({ error: 'URL invalide' }).optional(),
    accessKey: z.string().min(1, { error: 'Access key requis' }).optional(),
    secretKey: z.string().min(1, { error: 'Secret key requis' }).optional(),
    bucket: z
      .string()
      .regex(/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/, {
        error: 'Nom de bucket invalide',
      })
      .optional(),
  }),
]);

export type UpdateStorageConfigInput = z.infer<
  typeof updateStorageConfigSchema
>;
