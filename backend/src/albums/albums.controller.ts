import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  createAlbumSchema,
  updateAlbumSchema,
  addPhotoToAlbumSchema,
} from './albums.validation';

@Controller('albums')
@UseGuards(JwtGuard)
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: { sub: string; email: string },
    @Body() body: unknown,
  ) {
    const data = createAlbumSchema.parse(body);
    return this.albumsService.create(user.sub, data);
  }

  @Get()
  findAll(@CurrentUser() user: { sub: string; email: string }) {
    return this.albumsService.findAll(user.sub);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: { sub: string; email: string },
    @Param('id') id: string,
  ) {
    return this.albumsService.findOne(user.sub, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: { sub: string; email: string },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const data = updateAlbumSchema.parse(body);
    return this.albumsService.update(user.sub, id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(
    @CurrentUser() user: { sub: string; email: string },
    @Param('id') id: string,
  ) {
    return this.albumsService.delete(user.sub, id);
  }

  @Post(':id/photos')
  @HttpCode(HttpStatus.OK)
  addPhoto(
    @CurrentUser() user: { sub: string; email: string },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const data = addPhotoToAlbumSchema.parse(body);
    return this.albumsService.addPhoto(user.sub, id, data);
  }

  @Delete(':id/photos/:photoId')
  @HttpCode(HttpStatus.OK)
  removePhoto(
    @CurrentUser() user: { sub: string; email: string },
    @Param('id') id: string,
    @Param('photoId') photoId: string,
  ) {
    return this.albumsService.removePhoto(user.sub, id, photoId);
  }
}
