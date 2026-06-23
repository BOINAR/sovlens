import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { usersTable } from './users.schema';
import { z } from 'zod';

export const createUserSchema = createInsertSchema(usersTable);

export type CreateUserInput = z.infer<typeof createUserSchema>;


export const updateUserSchema = createUpdateSchema(usersTable).partial();

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
