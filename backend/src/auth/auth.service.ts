import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { AuthRepository } from './auth.repository';
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './auth.validation';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  // ─── Register ─────────────────────────────────────────────────────

  async register(data: RegisterInput) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }

    const passwordHash = await argon2.hash(data.password);

    await this.usersService.create({
      email: data.email,
      passwordHash,
    });

    return { message: 'Compte créé avec succès' };
  }

  // ─── Login ────────────────────────────────────────────────────────

  async login(data: LoginInput) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const accessToken = await this.generateAccessToken(user.id, user.email);
    const { rawToken, tokenHash, expiresAt } = this.generateRefreshToken();

    await this.authRepository.createRefreshToken(user.id, tokenHash, expiresAt);

    return { accessToken, refreshToken: rawToken };
  }

  // ─── Refresh ──────────────────────────────────────────────────────

  async refresh(rawRefreshToken: string) {
    const tokenHash = this.hashToken(rawRefreshToken);
    const stored = await this.authRepository.findRefreshToken(tokenHash);

    if (!stored) {
      throw new UnauthorizedException('Session expirée, veuillez vous reconnecter');
    }

    const user = await this.usersService.findById(stored.userId);

    await this.authRepository.deleteRefreshToken(tokenHash);
    const { rawToken, tokenHash: newHash, expiresAt } = this.generateRefreshToken();
    await this.authRepository.createRefreshToken(user.id, newHash, expiresAt);

    const accessToken = await this.generateAccessToken(user.id, user.email);

    return { accessToken, refreshToken: rawToken };
  }

  // ─── Logout ───────────────────────────────────────────────────────

  async logout(rawRefreshToken: string) {
    const tokenHash = this.hashToken(rawRefreshToken);
    await this.authRepository.deleteRefreshToken(tokenHash);
    return { message: 'Déconnecté avec succès' };
  }

  // ─── Forgot Password ──────────────────────────────────────────────

  async forgotPassword(data: ForgotPasswordInput) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      return { message: 'Si ce compte existe, un email a été envoyé' };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await this.authRepository.createPasswordResetToken(user.id, tokenHash, expiresAt);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe Sovlens',
      html: `
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p><a href="${resetUrl}">Cliquer ici pour réinitialiser votre mot de passe</a></p>
        <p>Ce lien expire dans 1 heure.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      `,
    });

    return { message: 'Si ce compte existe, un email a été envoyé' };
  }

  // ─── Reset Password ───────────────────────────────────────────────

  async resetPassword(data: ResetPasswordInput) {
    const tokenHash = this.hashToken(data.token);
    const stored = await this.authRepository.findPasswordResetToken(tokenHash);

    if (!stored) {
      throw new BadRequestException('Token invalide ou expiré');
    }

    const passwordHash = await argon2.hash(data.password);

    await this.usersService.updatePassword(stored.userId, passwordHash);
    await this.authRepository.markPasswordResetTokenAsUsed(stored.id);

    await this.authRepository.deleteAllRefreshTokens(stored.userId);

    return { message: 'Mot de passe modifié avec succès' };
  }

  // ─── Helpers privés ───────────────────────────────────────────────

  private async generateAccessToken(userId: string, email: string) {
    return this.jwtService.signAsync(
      { sub: userId, email },
      { expiresIn: '15m' },
    );
  }

  private generateRefreshToken() {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7j
    return { rawToken, tokenHash, expiresAt };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}