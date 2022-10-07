import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandbrakeService } from './services';
import { handbrakeConfig } from './handbrake.config';

@Module({
  imports: [ConfigModule.forFeature(handbrakeConfig)],
  providers: [HandbrakeService],
  exports: [HandbrakeService],
})
export class HandbrakeModule {}
