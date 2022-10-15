import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueueService } from './services';
import { queueConfig } from './queue.config';

@Module({
  imports: [ConfigModule.forFeature(queueConfig)],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
