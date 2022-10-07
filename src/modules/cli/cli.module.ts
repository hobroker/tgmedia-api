import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandbrakeModule } from '../handbrake';
import { cliConfig } from './cli.config';
import * as Commands from './commands';

@Module({
  imports: [ConfigModule.forFeature(cliConfig), HandbrakeModule],
  providers: [...Object.values(Commands)],
})
export class CliModule {}
