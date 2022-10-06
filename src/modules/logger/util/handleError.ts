import { Logger } from '@nestjs/common';

export const handleError =
  (logger: Logger, shouldThrow = false) =>
  (error: Error) => {
    logger.error(error.message, error.stack);

    if (shouldThrow) {
      throw error;
    }
  };
