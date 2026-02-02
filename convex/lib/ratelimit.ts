import type { Id } from "../_generated/dataModel";

const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 100; // 100 requests per minute

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Authentication endpoints - strict limits
  auth: { windowMs: 60 * 1000, maxRequests: 5 }, // 5 per minute
  login: { windowMs: 60 * 1000, maxRequests: 5 },
  register: { windowMs: 60 * 1000, maxRequests: 3 },

  // Webhooks - moderate limits
  webhook: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 per minute

  // Data mutations - generous but protective
  mutation: { windowMs: 60 * 1000, maxRequests: 100 },

  // General queries - reasonable limits
  query: { windowMs: 60 * 1000, maxRequests: 200 },

  // Default fallback
  default: { windowMs: 60 * 1000, maxRequests: 100 },
};

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given key
 * @param ctx - Convex context
 * @param key - Rate limit key (e.g., "ip:1.2.3.4" or "user:user_123")
 * @param category - Rate limit category (auth, webhook, mutation, query)
 * @returns Rate limit result
 */
export async function checkRateLimit(
  ctx: any,
  key: string,
  category: string = "default"
): Promise<RateLimitResult> {
  const config = RATE_LIMIT_CONFIGS[category] || RATE_LIMIT_CONFIGS.default;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Clean up old rate limit entries
  const oldEntries = await ctx.db
    .query("rateLimits")
    .withIndex("by_reset", (q: any) => q.lt("resetAt", windowStart))
    .collect();

  for (const entry of oldEntries) {
    await ctx.db.delete(entry._id);
  }

  // Get or create rate limit entry for this key
  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_key", (q: any) => q.eq("key", key))
    .first();

  if (!existing) {
    // First request - create new entry
    const resetAt = now + config.windowMs;
    await ctx.db.insert("rateLimits", {
      key,
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  // Check if window has expired
  if (existing.resetAt < now) {
    // Reset the window
    const resetAt = now + config.windowMs;
    await ctx.db.patch(existing._id, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  // Window still active - check limit
  if (existing.count >= config.maxRequests) {
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  // Increment count
  await ctx.db.patch(existing._id, {
    count: existing.count + 1,
  });

  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - existing.count - 1,
    resetAt: existing.resetAt,
  };
}

/**
 * Require rate limit check - throws if limit exceeded
 * @param ctx - Convex context
 * @param key - Rate limit key
 * @param category - Rate limit category
 * @throws Error if rate limit exceeded
 */
export async function requireRateLimit(
  ctx: any,
  key: string,
  category: string = "default"
): Promise<void> {
  const result = await checkRateLimit(ctx, key, category);

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
    throw new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`);
  }
}

/**
 * Create rate limit key from user identity
 * @param userId - User ID
 * @param action - Action name
 * @returns Rate limit key
 */
export function createUserRateLimitKey(userId: string, action: string): string {
  return `user:${userId}:${action}`;
}

/**
 * Create rate limit key from IP address (for unauthenticated requests)
 * @param ip - IP address
 * @param action - Action name
 * @returns Rate limit key
 */
export function createIpRateLimitKey(ip: string, action: string): string {
  return `ip:${ip}:${action}`;
}

/**
 * Create rate limit key from organization (for org-level limits)
 * @param orgId - Organization ID
 * @param action - Action name
 * @returns Rate limit key
 */
export function createOrgRateLimitKey(orgId: string, action: string): string {
  return `org:${orgId}:${action}`;
}
