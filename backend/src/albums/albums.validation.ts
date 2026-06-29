import { z } from 'zod';

export const createAlbumSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
});

export const updateAlbumSchema = z.object({
  name: z.string().min(1).max(100),
});

export const addPhotoToAlbumSchema = z.object({
  photoId: z.string().uuid(),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;
export type AddPhotoToAlbumInput = z.infer<typeof addPhotoToAlbumSchema>;