import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '../../http';
import { sonarrConfig } from '../sonarr.config';

@Injectable()
export class SonarrHttpConfigService implements HttpModuleOptionsFactory {
  constructor(
    @Inject(sonarrConfig.KEY)
    private config: ConfigType<typeof sonarrConfig>,
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
