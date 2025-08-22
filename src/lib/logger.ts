/**
 * Production-safe logger utility
 * Automatically strips all logging in production builds
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  group: (label: string) => void;
  groupEnd: () => void;
}

const isDevelopment = process.env.NODE_ENV === "development";

// Allow enabling logs in browser even in production via runtime toggles
const isBrowser = typeof window !== "undefined";
const browserDebugEnabled = (() => {
  if (!isBrowser) return false;
  try {
    const qsFlag = /(?:^|[?&])debug_logs=1(?:&|$)/.test(window.location.search);
    const lsFlag = window.localStorage.getItem("DEBUG_LOGS") === "1";
    const globalFlag = (window as any).__DEBUG_LOGS__ === true;
    return qsFlag || lsFlag || globalFlag;
  } catch {
    return false;
  }
})();

// Create logger that only works in development
const createLogger = (): Logger => {
  if (isDevelopment || browserDebugEnabled) {
    return {
      debug: console.log.bind(console),
      info: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      group: console.group.bind(console),
      groupEnd: console.groupEnd.bind(console),
    };
  }

  // Return no-op functions for production
  const noop = () => {};
  return {
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    group: noop,
    groupEnd: noop,
  };
};

export const logger = createLogger();

// For backwards compatibility, also export individual functions
export const { debug, info, warn, error } = logger;
