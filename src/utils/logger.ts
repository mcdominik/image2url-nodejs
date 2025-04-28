import config from "@config/index";

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

type LogLevel = keyof typeof LOG_LEVELS;

const CURRENT_LOG_LEVEL =
  LOG_LEVELS[config.logLevel as LogLevel] ?? LOG_LEVELS.info;

const log = (level: LogLevel, message: string, ...optionalParams: any[]) => {
  if (LOG_LEVELS[level] <= CURRENT_LOG_LEVEL) {
    const timestamp = new Date().toISOString();
    console[level](
      `[${timestamp}] [${level.toUpperCase()}] ${message}`,
      ...optionalParams
    );
  }
};

export const logger = {
  error: (message: string, ...optionalParams: any[]) =>
    log("error", message, ...optionalParams),
  warn: (message: string, ...optionalParams: any[]) =>
    log("warn", message, ...optionalParams),
  info: (message: string, ...optionalParams: any[]) =>
    log("info", message, ...optionalParams),
  debug: (message: string, ...optionalParams: any[]) =>
    log("debug", message, ...optionalParams),
};
