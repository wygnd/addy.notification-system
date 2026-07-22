import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserControllerV1 } from '@modules/users/controllers/controller';
import { UserService } from '@modules/users/services/service';
import { VkModule } from '@modules/vk/module';
import { IdentityModule } from '@modules/identity/module';
import { RedisModule } from '@modules/redis/module';

@Module({
  imports: [ConfigModule, VkModule, IdentityModule, RedisModule],
  controllers: [UserControllerV1],
  providers: [UserService],
})
export class UsersModule {}
