import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: unknown) {
    const data = registerSchema.parse(body);
    return this.authService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const data = loginSchema.parse(body);
    const { accessToken, refreshToken } = await this.authService.login(data);

    // Refresh token en httpOnly cookie — jamais exposé au JS côté client
    reply.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60, // 7j en secondes
    });

    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const rawRefreshToken = req.cookies?.['refresh_token'];

    if (!rawRefreshToken) {
      reply
        .status(HttpStatus.UNAUTHORIZED)
        .send({ message: 'Session expirée' });
      return;
    }

    const { accessToken, refreshToken } =
      await this.authService.refresh(rawRefreshToken);

    reply.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60,
    });

    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const rawRefreshToken = req.cookies?.['refresh_token'];

    if (rawRefreshToken) {
      await this.authService.logout(rawRefreshToken);
    }

    reply.clearCookie('refresh_token', { path: '/auth/refresh' });

    return { message: 'Déconnecté avec succès' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: unknown) {
    const data = forgotPasswordSchema.parse(body);
    return this.authService.forgotPassword(data);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: unknown) {
    const data = resetPasswordSchema.parse(body);
    return this.authService.resetPassword(data);
  }
}
