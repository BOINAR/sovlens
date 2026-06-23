import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE, DbClient } from 'src/db/drizzle.provider';
import { usersTable } from './users.schema';
import { CreateUserInput, UpdateUserInput } from './users.validation';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DbClient) {}

  async create(data: CreateUserInput) {
    const user = await this.db.insert(usersTable).values(data).returning();

    return user[0];
  }

  async findAll() {
    const users = await this.db.select().from(usersTable);

    console.log('users', users);

    return users;
  }

  async findOne(id: number) {
    const user = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user[0];
  }

  async update(id: number, data: UpdateUserInput) {
    const user = await this.db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();
    return user[0];
  }

  async remove(id: number) {
    const user = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
    return user;
  }
}
