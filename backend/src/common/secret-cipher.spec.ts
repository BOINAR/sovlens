import { randomBytes } from 'crypto';
import { decryptSecret, encryptSecret, isEncrypted } from './secret-cipher';

describe('secret-cipher', () => {
  const original = process.env.STORAGE_ENCRYPTION_KEY;

  afterEach(() => {
    process.env.STORAGE_ENCRYPTION_KEY = original;
  });

  describe('avec une clé configurée', () => {
    beforeEach(() => {
      process.env.STORAGE_ENCRYPTION_KEY = randomBytes(32).toString('base64');
    });

    it('chiffre puis déchiffre une valeur', () => {
      const encrypted = encryptSecret('ma-secret-key');

      expect(isEncrypted(encrypted)).toBe(true);
      expect(encrypted).not.toContain('ma-secret-key');
      expect(decryptSecret(encrypted)).toBe('ma-secret-key');
    });

    it('produit un résultat différent à chaque chiffrement (IV aléatoire)', () => {
      expect(encryptSecret('x')).not.toBe(encryptSecret('x'));
    });

    it('ne chiffre pas deux fois une valeur déjà chiffrée', () => {
      const once = encryptSecret('x');
      expect(encryptSecret(once)).toBe(once);
    });

    it('laisse passer null et les valeurs historiques en clair', () => {
      expect(encryptSecret(null)).toBeNull();
      expect(decryptSecret('ancienne-valeur-en-clair')).toBe(
        'ancienne-valeur-en-clair',
      );
    });

    it('rejette une valeur altérée', () => {
      const encrypted = encryptSecret('x');
      const tampered = encrypted.slice(0, -2) + 'AA';
      expect(() => decryptSecret(tampered)).toThrow();
    });

    it('rejette une clé de mauvaise taille', () => {
      process.env.STORAGE_ENCRYPTION_KEY =
        Buffer.from('trop-courte').toString('base64');
      expect(() => encryptSecret('x')).toThrow(/32 octets/);
    });
  });

  describe('sans clé configurée', () => {
    beforeEach(() => {
      delete process.env.STORAGE_ENCRYPTION_KEY;
    });

    it('stocke en clair (comportement historique)', () => {
      expect(encryptSecret('x')).toBe('x');
    });

    it('refuse de déchiffrer une valeur chiffrée', () => {
      process.env.STORAGE_ENCRYPTION_KEY = randomBytes(32).toString('base64');
      const encrypted = encryptSecret('x');
      delete process.env.STORAGE_ENCRYPTION_KEY;
      expect(() => decryptSecret(encrypted)).toThrow(/absente/);
    });
  });
});
