import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { DRIZZLE, DbClient } from 'src/db/drizzle.provider';
import { refreshTokensTable, passwordResetTokensTable } from '../users/users.schema';

@Injectable()
export class AuthRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DbClient) {}

  // ─── Refresh Tokens ───────────────────────────────────────────────

  async createRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    const [token] = await this.db
      .insert(refreshTokensTable)
      .values({ userId, tokenHash, expiresAt })
      .returning();
    return token;
  }

  async findRefreshToken(tokenHash: string) {
    const [token] = await this.db
      .select()
      .from(refreshTokensTable)
      .where(
        and(
          eq(refreshTokensTable.tokenHash, tokenHash),
          gt(refreshTokensTable.expiresAt, new Date()),
        ),
      );
    return token;
  }

  async deleteRefreshToken(tokenHash: string) {
    await this.db
      .delete(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenHash, tokenHash));
  }

  async deleteAllRefreshTokens(userId: string) {
    await this.db
      .delete(refreshTokensTable)
      .where(eq(refreshTokensTable.userId, userId));
  }

  // ─── Password Reset Tokens ────────────────────────────────────────

  async createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
    const [token] = await this.db
      .insert(passwordResetTokensTable)
      .values({ userId, tokenHash, expiresAt })
      .returning();
    return token;
  }

  async findPasswordResetToken(tokenHash: string) {
    const [token] = await this.db
      .select()
      .from(passwordResetTokensTable)
      .where(
        and(
          eq(passwordResetTokensTable.tokenHash, tokenHash),
          gt(passwordResetTokensTable.expiresAt, new Date()),
          isNull(passwordResetTokensTable.usedAt),
        ),
      );
    return token;
  }

  async markPasswordResetTokenAsUsed(id: string) {
    await this.db
      .update(passwordResetTokensTable)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokensTable.id, id));
  }
}