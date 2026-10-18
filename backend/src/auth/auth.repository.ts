import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, isNull, lt } from 'drizzle-orm';
import { DRIZZLE, DbClient } from 'src/db/drizzle.provider';
import {
  refreshTokensTable,
  passwordResetTokensTable,
} from '../users/users.schema';

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

  // Retourne le token quel que soit son état (actif, révoqué, expiré)
  async findRefreshTokenByHash(
    tokenHash: string,
  ): Promise<typeof refreshTokensTable.$inferSelect | undefined> {
    const [token] = await this.db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.tokenHash, tokenHash));
    return token;
  }

  // Révocation atomique : false si le token était déjà révoqué
  async revokeRefreshToken(tokenHash: string): Promise<boolean> {
    const revoked = await this.db
      .update(refreshTokensTable)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(refreshTokensTable.tokenHash, tokenHash),
          isNull(refreshTokensTable.revokedAt),
        ),
      )
      .returning({ id: refreshTokensTable.id });
    return revoked.length > 0;
  }

  async deleteExpiredRefreshTokens(userId: string) {
    await this.db
      .delete(refreshTokensTable)
      .where(
        and(
          eq(refreshTokensTable.userId, userId),
          lt(refreshTokensTable.expiresAt, new Date()),
        ),
      );
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

  async createPasswordResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    const [token] = await this.db
      .insert(passwordResetTokensTable)
      .values({ userId, tokenHash, expiresAt })
      .returning();
    return token;
  }

  async findPasswordResetToken(
    tokenHash: string,
  ): Promise<typeof passwordResetTokensTable.$inferSelect | undefined> {
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
