import { HttpProvider } from '@addy/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AddyApiProvider extends HttpProvider {
  constructor(private readonly configService: ConfigService) {
    const apiURI = configService.getOrThrow<string>('ADDY_API_URL');
    const username = configService.getOrThrow<string>('ADDY_API_USERNAME');
    const password = configService.getOrThrow<string>('ADDY_API_PASSWORD');

    const client = axios.create({
      baseURL: apiURI,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${btoa(`${username}:${password}`)}`
      },
    });

    super(client);
  }
}
