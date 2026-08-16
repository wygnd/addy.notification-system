import { IdentityModule } from '@modules/identity/module';
import { RedisModule } from '@modules/redis/module';
import { TelegramModule } from '@modules/telegram/module';
import {
  UserControllerV1,
  UserIDControllerV1,
} from '@modules/users/controllers';
import { UserService } from '@modules/users/services/service';
import { VkModule } from '@modules/vk/module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    VkModule,
    TelegramModule,
    IdentityModule,
    RedisModule,
  ],
  controllers: [UserControllerV1, UserIDControllerV1],
  providers: [UserService],
})
export class UsersModule {}
