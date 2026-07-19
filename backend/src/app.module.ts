import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { SharingModule } from './sharing/sharing.module';
import { HealthController } from './health.controller';
import { MetricsModule } from './metrics/metrics.module';
import { HttpMetricsMiddleware } from './metrics/http-metrics.middleware';

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
    SharingModule,
    MetricsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpMetricsMiddleware).forRoutes('*');
  }
}