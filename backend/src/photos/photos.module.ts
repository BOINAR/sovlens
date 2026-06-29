import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { PhotosRepository } from './photos.repository';
import { DbModule } from 'src/db/drizzle.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DbModule, StorageModule],
  controllers: [PhotosController],
  providers: [PhotosService, PhotosRepository],
})
export class PhotosModule {}