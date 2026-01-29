/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or Upstash
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param options - Rate limit configuration
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 10, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const resetAt = now + windowMs;
  
  const existing = rateLimitMap.get(identifier);
  
  if (!existing || existing.resetAt < now) {
    // First request or window expired - reset
    rateLimitMap.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: options.limit - 1, resetAt };
  }
  
  if (existing.count >= options.limit) {
    // Rate limit exceeded
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }
  
  // Increment count
  existing.count++;
  return { 
    success: true, 
    remaining: options.limit - existing.count, 
    resetAt: existing.resetAt 
  };
}

/**
 * Get client identifier from request headers
 */
export function getClientId(headers: Headers): string {
  // Try various headers for client IP
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a generic identifier
  return 'unknown';
}
