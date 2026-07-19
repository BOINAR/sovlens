import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { AlbumsRepository } from './albums.repository';
import { DbModule } from 'src/db/drizzle.module';
import { PhotosModule } from '../photos/photos.module';
import { StorageModule } from '../storage/storage.module';
import { StorageConfigModule } from '../storage-config/storage-config.module';

@Module({
  imports: [DbModule, PhotosModule, StorageModule, StorageConfigModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, AlbumsRepository],
  exports: [AlbumsRepository],
})
export class AlbumsModule {}
