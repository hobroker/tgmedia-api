import { Logger } from '@nestjs/common';
import { timer } from '../../../util/timer';

export const WithDuration =
  () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const logger = new Logger(target.constructor.name);
    const fn = descriptor.value;

    descriptor.value = async function (...args) {
      const time = timer();

      logger.log('start');

      const result = await fn.apply(this, args);

      logger.log('end', { ms: time() });

      return result;
    };
  };
