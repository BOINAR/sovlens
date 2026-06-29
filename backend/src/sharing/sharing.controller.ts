import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SharingService } from './sharing.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { createShareLinkSchema } from './sharing.validation';

@Controller('sharing')
export class SharingController {
  constructor(private readonly sharingService: SharingService) {}

  // Route publique — pas de guard JWT
  @Get(':token')
  getSharedResource(@Param('token') token: string) {
    return this.sharingService.getSharedResource(token);
  }

  // Routes protégées
  @Post('photos/:id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createPhotoShareLink(
    @CurrentUser() user: { sub: string; email: string },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const data = createShareLinkSchema.parse(body);
    return this.sharingService.createPhotoShareLink(user.sub, id, data);
  }

  @Post('albums/:id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  createAlbumShareLink(
    @CurrentUser() user: { sub: string; email: string },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const data = createShareLinkSchema.parse(body);
    return this.sharingService.createAlbumShareLink(user.sub, id, data);
  }

  @Delete(':token')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  revokeShareLink(
    @CurrentUser() user: { sub: string; email: string },
    @Param('token') token: string,
  ) {
    return this.sharingService.revokeShareLink(user.sub, token);
  }
}