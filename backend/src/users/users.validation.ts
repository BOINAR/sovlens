import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { usersTable } from './users.schema';

// Schéma de sélection — représente un user tel qu'il est en DB
export const userSchema = createSelectSchema(usersTable);

// Schéma d'insertion interne — utilisé uniquement par le repository
// passwordHash est attendu : c'est l'AuthService qui hashe avant d'appeler create()
export const createUserSchema = createInsertSchema(usersTable, {
  email: () => z.email(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schéma de mise à jour partielle
export const updateUserSchema = createUserSchema.partial();

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;