import { registerAs } from '@nestjs/config';
import { SONARR_MODULE_ID } from './sonarr.constants';

export const sonarrConfig = registerAs(SONARR_MODULE_ID, () => ({
  token: process.env.SONARR_TOKEN,
  baseURL: process.env.SONARR_BASE_URL,
  cloudflare: {
    clientId: process.env.MEDIA_CF_CLIENT_ID,
    clientSecret: process.env.MEDIA_CF_CLIENT_SECRET,
  },
}));
