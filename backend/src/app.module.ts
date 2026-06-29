import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/drizzle.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { PhotosModule } from './photos/photos.module';
import { AlbumsModule } from './albums/albums.module';
import { StorageConfigModule } from './storage-config/storage-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
    }),
    DbModule,
    UsersModule,
    AuthModule,
    StorageModule,
    PhotosModule,
    AlbumsModule,
    StorageConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}