import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { cliConfig } from './cli.config';
import * as Commands from './commands';

@Module({
  imports: [ConfigModule.forFeature(cliConfig)],
  providers: [...Object.values(Commands)],
})
export class CliModule {}
