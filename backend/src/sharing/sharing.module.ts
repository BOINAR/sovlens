import { Module } from '@nestjs/common';
import { SharingService } from './sharing.service';
import { SharingController } from './sharing.controller';
import { SharingRepository } from './sharing.repository';
import { DbModule } from 'src/db/drizzle.module';
import { PhotosModule } from '../photos/photos.module';
import { AlbumsModule } from '../albums/albums.module';
import { StorageModule } from '../storage/storage.module';
import { StorageConfigModule } from '../storage-config/storage-config.module';

@Module({
  imports: [
    DbModule,
    PhotosModule,
    AlbumsModule,
    StorageModule,
    StorageConfigModule,
  ],
  controllers: [SharingController],
  providers: [SharingService, SharingRepository],
})
export class SharingModule {}
