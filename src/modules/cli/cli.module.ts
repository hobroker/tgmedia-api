import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from '../telegram';
import { cliConfig } from './cli.config';
import * as Commands from './commands';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production'],
    }),
    ConfigModule.forFeature(cliConfig),
    TelegramModule,
  ],
  providers: [...Object.values(Commands)],
})
export class CliModule {}
