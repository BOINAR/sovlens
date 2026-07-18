import {
  createAlbumSchema,
  updateAlbumSchema,
  addPhotoToAlbumSchema,
} from './albums.validation';

describe('albums.validation', () => {
  describe('createAlbumSchema', () => {
    it('devrait valider un nom correct', () => {
      const result = createAlbumSchema.safeParse({ name: 'Vacances été' });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un nom vide', () => {
      const result = createAlbumSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un nom trop long', () => {
      const result = createAlbumSchema.safeParse({ name: 'a'.repeat(101) });
      expect(result.success).toBe(false);
    });
  });

  describe('updateAlbumSchema', () => {
    it('devrait valider un nouveau nom', () => {
      const result = updateAlbumSchema.safeParse({ name: 'Nouveau nom' });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un nom vide', () => {
      const result = updateAlbumSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('addPhotoToAlbumSchema', () => {
    it('devrait valider un UUID correct', () => {
      const result = addPhotoToAlbumSchema.safeParse({
        photoId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un ID non-UUID', () => {
      const result = addPhotoToAlbumSchema.safeParse({ photoId: 'not-a-uuid' });
      expect(result.success).toBe(false);
    });
  });
});
