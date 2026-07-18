import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, DbClient } from 'src/db/drizzle.provider';
import { usersTable } from './users.schema';
import { CreateUserInput, UpdateUserInput } from './users.validation';

@Injectable()
export class UsersRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DbClient) {}

  async create(data: CreateUserInput) {
    const [user] = await this.db.insert(usersTable).values(data).returning();
    return user;
  }

  async findById(
    id: string,
  ): Promise<typeof usersTable.$inferSelect | undefined> {
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    return user;
  }

  async findByEmail(
    email: string,
  ): Promise<typeof usersTable.$inferSelect | undefined> {
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return user;
  }

  async update(id: string, data: UpdateUserInput) {
    const [user] = await this.db
      .update(usersTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning();

    return user;
  }

  async updatePassword(id: string, passwordHash: string) {
    const [user] = await this.db
      .update(usersTable)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning();

    return user;
  }
}
