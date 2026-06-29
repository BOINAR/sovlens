import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { PhotosService } from './photos.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';


@Controller('photos')
@UseGuards(JwtGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @Req() req: FastifyRequest,
    @CurrentUser() user: { sub: string; email: string },
  ) {
    const data = await req.file();

    if (!data) {
      throw new Error('Aucun fichier reçu');
    }

    const buffer = await data.toBuffer();

    return this.photosService.upload(
      user.sub,
      buffer,
      data.filename,
      data.mimetype,
      buffer.length,
    );
  }

  @Get(':id/download')
async download(
  @CurrentUser() user: { sub: string; email: string },
  @Param('id') id: string,
  @Res() reply: FastifyReply,
) {
  const { stream, photo } = await this.photosService.download(user.sub, id);

  reply.header('Content-Disposition', `attachment; filename="${photo.originalName}"`);
  reply.header('Content-Type', photo.mimeType);
  reply.send(stream);
}

  @Get()
  findAll(@CurrentUser() user: { sub: string; email: string }) {
    return this.photosService.findAll(user.sub);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: { sub: string; email: string },
    @Param('id') id: string,
  ) {
    return this.photosService.findOne(user.sub, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(
    @CurrentUser() user: { sub: string; email: string },
    @Param('id') id: string,
  ) {
    return this.photosService.delete(user.sub, id);
  }
}