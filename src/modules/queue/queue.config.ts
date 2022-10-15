import { registerAs } from '@nestjs/config';
import { QUEUE_MODULE_ID } from './queue.constants';

export const queueConfig = registerAs(QUEUE_MODULE_ID, () => ({}));
