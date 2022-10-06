import { LoggerService as LoggerServiceInterface } from '@nestjs/common';
import { CustomLogger } from './util';

export class LoggerService implements LoggerServiceInterface {
  private logger: CustomLogger;

  constructor(withTime = true) {
    this.logger = new CustomLogger(withTime);
  }

  log(message: any, ...rest: any[]) {
    this.logger.log(rest.pop(), message, ...rest);
  }

  error(message: any, ...rest: any[]) {
    this.logger.error(rest.pop(), message, ...rest);
  }

  warn(message: any, ...rest: any[]) {
    this.logger.warn(rest.pop(), message, ...rest);
  }

  debug?(message: any, ...rest: any[]) {
    this.logger.debug(rest.pop(), message, ...rest);
  }

  verbose?(message: any, ...rest: any[]) {
    this.logger.verbose(rest.pop(), message, ...rest);
  }
}
