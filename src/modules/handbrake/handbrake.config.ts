import { registerAs } from '@nestjs/config';
import { HANDBRAKE_MODULE_ID } from './handbrake.constants';

export const handbrakeConfig = registerAs(HANDBRAKE_MODULE_ID, () => ({
  preset: process.env.HANDBRAKE_PRESET,
  tmpFolder: process.env.HANDBRAKE_CONVERT_FOLDER,
  alwaysConvert: process.env.HANDBRAKE_ALWAYS_CONVERT === 'true',
}));
