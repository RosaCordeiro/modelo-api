import pino, { Logger } from 'pino';
import { createStream } from 'rotating-file-stream';
import fs from 'fs';
import { PassThrough } from 'stream';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = packageJson.version;

interface LoggerOptions {
    logDir?: string;
    fileName?: string;
    pretty?: boolean;
    maxSize?: `${number}B` | `${number}K` | `${number}M` | `${number}G`;
    rotateInterval?: `${number}M` | `${number}d` | `${number}h` | `${number}m` | `${number}s`;
    maxFiles?: number;
}

export class LoggerProvider {
    private logger: Logger;
    private currentLevel: string;

    private readonly levelHierarchy = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const;

    constructor(options: LoggerOptions = {}) {
        this.currentLevel = process.env.LOG_LEVEL || 'info';

        const {
            logDir = './logs',
            fileName = 'app.log',
            pretty = false,
            maxSize = '10M',
            rotateInterval = '1d',
            maxFiles = 7,
        } = options;

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const rotatingStream: NodeJS.WritableStream = createStream(fileName, {
            path: logDir,
            size: maxSize,
            interval: rotateInterval,
            maxFiles,
            compress: 'gzip',
        });

        let destinationStream: NodeJS.WritableStream = rotatingStream;

        if (pretty) {
            const tee = new PassThrough();
            tee.pipe(process.stdout);
            tee.pipe(rotatingStream);
            destinationStream = tee;
        }

        this.logger = pino(
            {
                level: this.currentLevel,
                timestamp: pino.stdTimeFunctions.isoTime,
            },
            destinationStream
        ).child({
            service_type: process.env.PREFIX_LOGGER,
            app_name: process.env.APINAME,
            environment: process.env.AMBIENTE,
            version: version
        });
    }

    setLevel(level: pino.Level): boolean {
        if (this.levelHierarchy.includes(level)) {
            this.currentLevel = level;
            this.logger.level = level;

            return true;
        }

        return false;
    }

    getLevel(): string {
        return this.currentLevel;
    }

    getActiveLevels(): string[] {
        const currentIndex = this.levelHierarchy.indexOf(this.currentLevel as any);
        return this.levelHierarchy.slice(currentIndex);
    }

    trace = (msg: string, obj?: any) => obj ? this.logger.trace(obj, msg) : this.logger.trace(msg);
    debug = (msg: string, obj?: any) => obj ? this.logger.debug(obj, msg) : this.logger.debug(msg);
    info = (msg: string, obj?: any) => obj ? this.logger.info(obj, msg) : this.logger.info(msg);
    warn = (msg: string, obj?: any) => obj ? this.logger.warn(obj, msg) : this.logger.warn(msg);
    error = (msg: string, obj?: any) => obj ? this.logger.error(obj, msg) : this.logger.error(msg);
    fatal = (msg: string, obj?: any) => obj ? this.logger.fatal(obj, msg) : this.logger.fatal(msg);

    isLevelEnabled(level: pino.Level): boolean {
        return this.logger.isLevelEnabled(level);
    }

}
