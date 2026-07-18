import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { PhotosRepository } from './photos.repository';
import { DbModule } from 'src/db/drizzle.module';
import { StorageModule } from '../storage/storage.module';
import { StorageConfigModule } from '../storage-config/storage-config.module';

@Module({
  imports: [DbModule, StorageModule, StorageConfigModule],
  controllers: [PhotosController],
  providers: [PhotosService, PhotosRepository],
  exports: [PhotosRepository],
})
export class PhotosModule {}
