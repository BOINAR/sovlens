import { z } from 'zod';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const uploadPhotoSchema = z.object({
  mimeType: z.string().refine((type) => ALLOWED_MIME_TYPES.includes(type), {
    message: 'Format non supporté. Formats acceptés : JPEG, PNG, WebP, GIF',
  }),
  size: z.number().max(MAX_SIZE, 'La photo ne doit pas dépasser 10MB'),
  originalName: z.string().min(1),
});

export type UploadPhotoInput = z.infer<typeof uploadPhotoSchema>;
