import { updateStorageConfigSchema } from './storage-config.validation';

describe('storage-config.validation', () => {
  describe('updateStorageConfigSchema', () => {
    it('devrait valider le mode cloud sans credentials', () => {
      const result = updateStorageConfigSchema.safeParse({ mode: 'cloud' });
      expect(result.success).toBe(true);
    });

    it('devrait valider le mode souverain avec tous les credentials', () => {
      const result = updateStorageConfigSchema.safeParse({
        mode: 'sovereign',
        endpoint: 'http://192.168.1.20:3900',
        accessKey: 'access-key',
        secretKey: 'secret-key',
        bucket: 'sovlens-photos',
      });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter le mode souverain sans endpoint', () => {
      const result = updateStorageConfigSchema.safeParse({
        mode: 'sovereign',
        accessKey: 'access-key',
        secretKey: 'secret-key',
        bucket: 'sovlens-photos',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter une URL invalide pour endpoint', () => {
      const result = updateStorageConfigSchema.safeParse({
        mode: 'sovereign',
        endpoint: 'pas-une-url',
        accessKey: 'access-key',
        secretKey: 'secret-key',
        bucket: 'sovlens-photos',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un mode invalide', () => {
      const result = updateStorageConfigSchema.safeParse({ mode: 'invalid' });
      expect(result.success).toBe(false);
    });
  });
});