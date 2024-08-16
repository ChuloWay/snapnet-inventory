import { createLogger, transports, format, Logger as WinstonLogger } from 'winston';
const { combine, timestamp, printf, colorize, align } = format;

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'gray'
  }
};

const logFormat = printf(({ level, message, timestamp, context, ...additionalInfo }) => {
  let additional = '';
  if (Object.keys(additionalInfo).length) {
    additional = ` ${JSON.stringify(additionalInfo, null, 2)}`;
  }
  return `${timestamp} ${level} ${context ? `[${context}]` : ''} ${message}${additional}`;
});

const logger: WinstonLogger = createLogger({
  levels: customLevels.levels,
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    logFormat
  ),
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL || 'info'
    })
  ]
});

// logger.colors = customLevels.colors;

export default logger;
