import { z } from 'zod/v4';

// Email normalisé (trim + minuscules) avant validation du format
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Adresse e-mail invalide'));

// Inscription — l'utilisateur envoie un mot de passe en clair
export const registerSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

// Connexion
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1),
});

// Mot de passe oublié
export const forgotPasswordSchema = z.object({
  email: emailField,
});

// Réinitialisation du mot de passe
export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
