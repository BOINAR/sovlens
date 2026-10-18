import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { UsersService } from './users.service';
import { UpdateUserInput, updateUserSchema } from './users.validation';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: { sub: string; email: string }) {
    return this.usersService.getMe(user.sub);
  }

  @Post('me/avatar')
  async uploadAvatar(
    @Req() req: FastifyRequest,
    @CurrentUser() user: { sub: string; email: string },
  ) {
    const data = await req.file();

    if (!data) {
      throw new BadRequestException('Aucun fichier reçu');
    }

    const buffer = await data.toBuffer();
    return this.usersService.uploadAvatar(user.sub, buffer, data.mimetype);
  }

  @Delete('me/avatar')
  removeAvatar(@CurrentUser() user: { sub: string; email: string }) {
    return this.usersService.removeAvatar(user.sub);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const data: UpdateUserInput = updateUserSchema.parse(body);
    return this.usersService.update(id, data);
  }
}
