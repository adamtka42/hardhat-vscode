// Google Analytics
export const HYPERION_GA_SECRET = process.env.HYPERION_GA_SECRET ?? "";
export const HYPERION_GOOGLE_TRACKING_ID =
  process.env.HYPERION_GOOGLE_TRACKING_ID ?? "";

// every 10 mins (ga sessions stop with 30mins inactivty)
export const HEARTBEAT_PERIOD = 10 * 60 * 1000;

// Sentry
export const HYPERION_SENTRY_DSN = process.env.HYPERION_SENTRY_DSN ?? "";
