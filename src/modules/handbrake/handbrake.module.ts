import { Module } from '@nestjs/common';
import { HandbrakeService } from './services';

@Module({
  providers: [HandbrakeService],
  exports: [HandbrakeService],
})
export class HandbrakeModule {}
