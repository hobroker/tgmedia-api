import { spawn } from 'child_process';
import * as path from 'path';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { handbrakeConfig } from '../handbrake.config';

@Injectable()
export class HandbrakeService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(handbrakeConfig.KEY)
    private config: ConfigType<typeof handbrakeConfig>,
  ) {}

  async convert(input: string, callback?: (progress: string) => void) {
    const output = path.format({
      ...path.parse(input),
      base: '',
      dir: '/tmp',
      ext: '.mp4',
    });

    return new Promise<string>((resolve) => {
      const child = spawn('HandBrakeCLI', [
        '-i',
        input,
        '-o',
        output,
        '--preset',
        this.config.preset,
      ]);

      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (data) => {
        if (data.includes('Encoding')) {
          callback?.(data);
        }
      });

      child.stderr.setEncoding('utf8');

      child.on('close', (code) => {
        this.logger.debug(`exit with: ${code}`);
        resolve(output);
      });
    });
  }
}
