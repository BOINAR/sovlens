import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { StorageConfigService } from './storage-config.service';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { updateStorageConfigSchema } from './storage-config.validation';

@Controller('storage')
@UseGuards(JwtGuard)
export class StorageConfigController {
  constructor(private readonly storageConfigService: StorageConfigService) {}

  @Get('config')
  getConfig(@CurrentUser() user: { sub: string; email: string }) {
    return this.storageConfigService.getConfig(user.sub);
  }

  @Patch('config')
  @HttpCode(HttpStatus.OK)
  updateConfig(
    @CurrentUser() user: { sub: string; email: string },
    @Body() body: unknown,
  ) {
    const data = updateStorageConfigSchema.parse(body);
    return this.storageConfigService.updateConfig(user.sub, data);
  }
}
