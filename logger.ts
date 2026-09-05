/**
 * Minimal structured logger for the Zenna server.
 *
 * This is intentionally dependency-free so it works the same in local dev,
 * the bundled esbuild output, and Firebase Functions. It gives us:
 *  - consistent, greppable log lines (level, timestamp, message, meta)
 *  - a single choke point to later swap in a real APM/logging provider
 *    (e.g. Sentry, Google Cloud Logging, Datadog) without touching callers.
 */

type LogLevel = "info" | "warn" | "error";

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
};
