import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
// adjust path if your module folder is named "posts" instead of "post"

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth-guard';

@Module({
  imports: [
    UsersModule, 
    AuthModule,
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [AppController],
  providers: [AppService,
    {
    provide : APP_GUARD,
    useClass: AuthGuard,}
  ],
})
export class AppModule {}
