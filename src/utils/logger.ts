/* eslint-disable @typescript-eslint/no-explicit-any */

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
}

// Ensure debug logs are visible in development
const currentLogLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.ERROR;

const canLog = (level: LogLevel): boolean => {
  // In development, always allow logging
  if (import.meta.env.DEV) {
    return true;
  }
  return level >= currentLogLevel;
};

export const logDebug = (...messages: any[]) => {
  if (canLog(LogLevel.DEBUG)) {
    console.debug("[DEBUG]", ...messages);
  }
};

export const logInfo = (...messages: any[]) => {
  if (canLog(LogLevel.INFO)) {
    console.info("[INFO]", ...messages);
  }
};

export const logWarn = (...messages: any[]) => {
  if (canLog(LogLevel.WARN)) {
    console.warn("[WARN]", ...messages);
  }
};

export const logError = (...messages: any[]) => {
  if (canLog(LogLevel.ERROR)) {
    console.error("[ERROR]", ...messages);
  }
};

export const logFatal = (...messages: any[]) => {
  if (canLog(LogLevel.FATAL)) {
    console.error("[FATAL]", ...messages);
  }
};
