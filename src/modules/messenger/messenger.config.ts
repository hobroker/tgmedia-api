import { registerAs } from '@nestjs/config';
import { MESSENGER_MODULE_ID } from './messenger.constants';

export const messengerConfig = registerAs(MESSENGER_MODULE_ID, () => ({
  overrideMediaPath: process.env.MESSENGER_OVERRIDE_MEDIA_PATH || null,
}));
