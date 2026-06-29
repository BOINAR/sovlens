import { z } from 'zod';

export const updateStorageConfigSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('cloud'),
  }),
  z.object({
    mode: z.literal('sovereign'),
    endpoint: z.string().url('URL invalide'),
    accessKey: z.string().min(1, 'Access key requis'),
    secretKey: z.string().min(1, 'Secret key requis'),
    bucket: z.string().min(1, 'Bucket requis'),
  }),
]);

export type UpdateStorageConfigInput = z.infer<typeof updateStorageConfigSchema>;