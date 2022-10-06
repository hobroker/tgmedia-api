import { registerAs } from '@nestjs/config';
import { RADARR_MODULE_ID } from './radarr.constants';

export const radarrConfig = registerAs(RADARR_MODULE_ID, () => ({
  token: process.env.RADARR_TOKEN,
  baseUrl: process.env.RADARR_BASE_URL,
}));
