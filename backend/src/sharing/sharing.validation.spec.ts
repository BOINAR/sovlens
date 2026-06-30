import { createShareLinkSchema } from './sharing.validation';

describe('sharing.validation', () => {
  describe('createShareLinkSchema', () => {
    it('devrait valider sans expiresAt', () => {
      const result = createShareLinkSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('devrait valider avec une date ISO valide', () => {
      const result = createShareLinkSchema.safeParse({
        expiresAt: '2026-12-31T23:59:59.000Z',
      });
      expect(result.success).toBe(true);
    });

    it('devrait valider avec expiresAt null', () => {
      const result = createShareLinkSchema.safeParse({ expiresAt: null });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter une date invalide', () => {
      const result = createShareLinkSchema.safeParse({
        expiresAt: 'pas-une-date',
      });
      expect(result.success).toBe(false);
    });
  });
});