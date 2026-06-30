import { uploadPhotoSchema } from './photos.validation';

describe('photos.validation', () => {
  describe('uploadPhotoSchema', () => {
    it('devrait valider une photo correcte', () => {
      const result = uploadPhotoSchema.safeParse({
        mimeType: 'image/webp',
        size: 1000,
        originalName: 'photo.webp',
      });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un format non supporté', () => {
      const result = uploadPhotoSchema.safeParse({
        mimeType: 'application/pdf',
        size: 1000,
        originalName: 'document.pdf',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un fichier trop volumineux', () => {
      const result = uploadPhotoSchema.safeParse({
        mimeType: 'image/webp',
        size: 11 * 1024 * 1024,
        originalName: 'photo.webp',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un nom de fichier vide', () => {
      const result = uploadPhotoSchema.safeParse({
        mimeType: 'image/webp',
        size: 1000,
        originalName: '',
      });
      expect(result.success).toBe(false);
    });

    it('devrait accepter tous les formats autorisés', () => {
      const formats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      formats.forEach((mimeType) => {
        const result = uploadPhotoSchema.safeParse({
          mimeType,
          size: 1000,
          originalName: 'photo.ext',
        });
        expect(result.success).toBe(true);
      });
    });
  });
});