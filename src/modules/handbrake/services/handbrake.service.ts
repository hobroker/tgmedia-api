import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { handbrakeConfig } from '../handbrake.config';

export type HandbrakeConvertOptions = {
  input: string;
  outputFilename: string | number;
  ext?: '.mp4';
};

@Injectable()
export class HandbrakeService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(handbrakeConfig.KEY)
    private config: ConfigType<typeof handbrakeConfig>,
  ) {}

  async convert(
    { input, outputFilename, ext = '.mp4' }: HandbrakeConvertOptions,
    callback?: (progress: string) => void,
  ) {
    this.logger.debug('input', input);

    if (!this.shouldConvert(input)) {
      return input;
    }

    const output = path.resolve(
      this.config.tmpFolder,
      `${outputFilename}${ext}`,
    );
    const outputExists = await this.fileExists(output);

    if (outputExists) {
      return output;
    }

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

  removeFileIfNeeded({ outputFilePath }: { outputFilePath: string }) {
    if (!this.config.removeFileWhenDone) {
      return;
    }

    const { dir } = path.parse(outputFilePath);
    const shouldDelete = dir.endsWith(this.config.tmpFolder);

    if (!shouldDelete) {
      return;
    }

    this.logger.error('removing file', outputFilePath);

    return new Promise((resolve) => {
      fs.rm(outputFilePath, (err) => {
        if (err) {
          this.logger.error('error removing file', outputFilePath, err);

          return resolve(false);
        }

        this.logger.error('removed file', outputFilePath);
        resolve(true);
      });
    });
  }

  private shouldConvert(input: string) {
    return this.config.alwaysConvert || !input.endsWith('.mp4');
  }

  private fileExists(path: string) {
    return new Promise((resolve) =>
      fs.access(path, fs.constants.F_OK, (err) => {
        resolve(!err);
      }),
    );
  }
}
