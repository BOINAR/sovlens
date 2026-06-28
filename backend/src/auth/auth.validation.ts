import { z } from 'zod/v4';

// Inscription — l'utilisateur envoie un mot de passe en clair
export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

// Connexion
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

// Mot de passe oublié
export const forgotPasswordSchema = z.object({
  email: z.email(),
});

// Réinitialisation du mot de passe
export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;