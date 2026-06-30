import { createUserSchema, updateUserSchema, userSchema } from './users.validation';

describe('users.validation', () => {
  describe('createUserSchema', () => {
    it('devrait valider un email et passwordHash corrects', () => {
      const result = createUserSchema.safeParse({
        email: 'test@sovlens.com',
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$hash',
      });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un email invalide', () => {
      const result = createUserSchema.safeParse({
        email: 'pas-un-email',
        passwordHash: 'hash',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter si passwordHash manquant', () => {
      const result = createUserSchema.safeParse({
        email: 'test@sovlens.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateUserSchema', () => {
    it('devrait valider une mise à jour partielle', () => {
      const result = updateUserSchema.safeParse({
        email: 'nouveau@sovlens.com',
      });
      expect(result.success).toBe(true);
    });

    it('devrait valider un objet vide (tout est optionnel)', () => {
      const result = updateUserSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('userSchema', () => {
    it('devrait valider un utilisateur complet', () => {
      const result = userSchema.safeParse({
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@sovlens.com',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      expect(result.success).toBe(true);
    });
  });
});