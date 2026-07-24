import { normalizeError } from '@addy/common';
import { IVkApiPort, VkApiMethods } from '@modules/vk/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import VkBot from 'node-vk-bot-api';

@Injectable()
export class VkApiService implements IVkApiPort {
  private readonly logger = new Logger(VkApiService.name);
  private readonly api: VkBot;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.getOrThrow<string>('VK_BOT_API_KEY');

    this.api = new VkBot(token);
  }

  public async sendMessage(
    userId: number | string,
    message: string,
  ): Promise<void> {
    try {
      await this.api.sendMessage(userId, message);
    } catch (err) {
      this.logger.error(normalizeError(err));
    }
  }

  public async execute<T = unknown>(
    method: VkApiMethods,
    params: Record<string, unknown> = {},
  ): Promise<T> {
    return (await this.api.execute(method, params)) as T;
  }
}
