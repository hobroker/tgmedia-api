import { registerAs } from '@nestjs/config';
import { APP_MODULE_ID } from './app.constants';

export const appConfig = registerAs(APP_MODULE_ID, () => ({
  port: parseInt(process.env.PORT, 10),
}));
