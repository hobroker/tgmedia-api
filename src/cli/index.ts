import { CommandFactory } from 'nest-commander';
import { CliModule } from '../modules/cli';
import { LoggerService } from '../modules/logger';

async function bootstrap() {
  await CommandFactory.run(CliModule, new LoggerService());
}

bootstrap();
