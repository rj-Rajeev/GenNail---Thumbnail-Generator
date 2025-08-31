// Track requests per user
const userRequests = new Map<string, { count: number; lastReset: number }>();

const DAILY_LIMIT = 5;

function getTodayMidnight(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

/**
 * Peek without decrementing
 */
export function peekRateLimit(userId: string) {
  const today = getTodayMidnight();
  const entry = userRequests.get(userId);

  if (!entry || entry.lastReset < today) {
    return { remaining: DAILY_LIMIT };
  }

  return { remaining: DAILY_LIMIT - entry.count };
}

/**
 * Decrement limit after successful usage
 */
export function decrementRateLimit(userId: string) {
  const today = getTodayMidnight();
  const entry = userRequests.get(userId);

  if (!entry || entry.lastReset < today) {
    userRequests.set(userId, { count: 1, lastReset: today });
    return { remaining: DAILY_LIMIT - 1 };
  }

  entry.count += 1;
  return { remaining: DAILY_LIMIT - entry.count };
}
