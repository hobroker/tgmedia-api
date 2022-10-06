import { registerAs } from '@nestjs/config';
import { always } from 'ramda';
import { CLI_MODULE_ID } from './cli.constants';

export const cliConfig = registerAs(CLI_MODULE_ID, always({}));
