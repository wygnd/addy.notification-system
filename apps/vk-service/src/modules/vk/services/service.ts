import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import VkBot from 'node-vk-bot-api';

@Injectable()
export class VkService {
  private readonly bot: VkBot;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.getOrThrow<string>('VK_BOT_API_KEY');

    this.bot = new VkBot(token);
  }

  public async sendMessage(userId: number, message: string) {
    try {
      const messageId = await this.bot.sendMessage(userId, message);

      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      return {
        ok: false,
      };
    }
  }
}
