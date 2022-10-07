import { registerAs } from '@nestjs/config';
import { RADARR_MODULE_ID } from './radarr.constants';

export const radarrConfig = registerAs(RADARR_MODULE_ID, () => ({
  token: process.env.RADARR_TOKEN,
  baseURL: process.env.RADARR_BASE_URL,
  cloudflare: {
    clientId: process.env.RADARR_CF_CLIENT_ID,
    clientSecret: process.env.RADARR_CF_CLIENT_SECRET,
  },
}));
