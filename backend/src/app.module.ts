import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/drizzle.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }), DbModule,UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
