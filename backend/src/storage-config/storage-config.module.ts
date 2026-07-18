import { Module } from '@nestjs/common';
import { StorageConfigService } from './storage-config.service';
import { StorageConfigController } from './storage-config.controller';
import { StorageConfigRepository } from './storage-config.repository';
import { DbModule } from 'src/db/drizzle.module';

@Module({
  imports: [DbModule],
  controllers: [StorageConfigController],
  providers: [StorageConfigService, StorageConfigRepository],
  exports: [StorageConfigService, StorageConfigRepository],
})
export class StorageConfigModule {}
