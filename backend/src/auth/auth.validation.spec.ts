import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation';

describe('auth.validation', () => {
  describe('registerSchema', () => {
    it('devrait valider des données correctes', () => {
      const result = registerSchema.safeParse({
        email: 'test@sovlens.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un email invalide', () => {
      const result = registerSchema.safeParse({
        email: 'pas-un-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un mot de passe trop court', () => {
      const result = registerSchema.safeParse({
        email: 'test@sovlens.com',
        password: '1234567',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter si email manquant', () => {
      const result = registerSchema.safeParse({ password: 'password123' });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('devrait valider des identifiants corrects', () => {
      const result = loginSchema.safeParse({
        email: 'test@sovlens.com',
        password: 'anything',
      });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un mot de passe vide', () => {
      const result = loginSchema.safeParse({
        email: 'test@sovlens.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un email invalide', () => {
      const result = loginSchema.safeParse({
        email: 'invalide',
        password: 'password',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('devrait valider un email correct', () => {
      const result = forgotPasswordSchema.safeParse({
        email: 'test@sovlens.com',
      });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un email invalide', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'pas-bon' });
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('devrait valider un token et mot de passe corrects', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'valid-token',
        password: 'newpassword123',
      });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un token vide', () => {
      const result = resetPasswordSchema.safeParse({
        token: '',
        password: 'newpassword123',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un mot de passe trop court', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'valid-token',
        password: '123',
      });
      expect(result.success).toBe(false);
    });
  });
});