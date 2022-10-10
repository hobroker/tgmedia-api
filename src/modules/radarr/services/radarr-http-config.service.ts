import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { HttpModuleOptions, HttpModuleOptionsFactory } from '../../http';
import { radarrConfig } from '../radarr.config';

@Injectable()
export class RadarrHttpConfigService implements HttpModuleOptionsFactory {
  constructor(
    @Inject(radarrConfig.KEY)
    private config: ConfigType<typeof radarrConfig>,
  ) {}

  async createHttpOptions(): Promise<HttpModuleOptions> {
    const { baseURL, cloudflare, token } = this.config;

    return {
      baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Api-Key': token,
        'CF-Access-Client-Id': cloudflare.clientId,
        'CF-Access-Client-Secret': cloudflare.clientSecret,
      },
    };
  }
}
