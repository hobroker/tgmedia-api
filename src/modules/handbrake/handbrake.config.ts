import { registerAs } from '@nestjs/config';
import { HANDBRAKE_MODULE_ID } from './handbrake.constants';

export const handbrakeConfig = registerAs(HANDBRAKE_MODULE_ID, () => ({
  tmpFolder: process.env.HANDBRAKE_CONVERT_FOLDER,
  handbrakePath: process.env.HANDBRAKE_PATH,
  handbrakeArgs: process.env.HANDBRAKE_ARGS,
  alwaysConvert: process.env.HANDBRAKE_ALWAYS_CONVERT === 'true',
  removeFileWhenDone: process.env.HANDBRAKE_REMOVE_WHEN_DONE === 'true',
}));
