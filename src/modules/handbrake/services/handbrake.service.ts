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

  async convert(
    input: string,
    filename: string,
    callback?: (progress: string) => void,
  ) {
    this.logger.debug('input', input);

    if (!this.shouldConvert(input)) {
      return input;
    }

    const output = path.resolve(this.config.tmpFolder, filename);
    const log = (data) => {
      const text = data.split('\n').find((item) => item.includes('Encoding'));

      if (!data.includes(text)) return;
      callback?.(text);
    };

    this.logger.debug('output', output);

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
      child.stdout.on('data', log);

      child.stderr.setEncoding('utf8');
      child.stdout.on('data', log);

      child.on('close', (code) => {
        this.logger.debug(`exit with: ${code}`);
        resolve(output);
      });
    });
  }

  private shouldConvert(input: string) {
    return this.config.alwaysConvert || !input.endsWith('.mp4');
  }
}
