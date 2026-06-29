import { Module } from '@nestjs/common';
import { SharingService } from './sharing.service';
import { SharingController } from './sharing.controller';
import { SharingRepository } from './sharing.repository';
import { DbModule } from 'src/db/drizzle.module';
import { PhotosModule } from '../photos/photos.module';
import { AlbumsModule } from '../albums/albums.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DbModule, PhotosModule, AlbumsModule, StorageModule],
  controllers: [SharingController],
  providers: [SharingService, SharingRepository],
})
export class SharingModule {}