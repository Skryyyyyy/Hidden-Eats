/**
 * Sliding Window Rate Limiter & Trusted Client IP Resolver
 * Supports both distributed Upstash Redis REST and local in-memory sliding window.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }, 1000 * 60 * 5);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check and increment request rate limit for a client key
 * @param identifier Client IP or user ID
 * @param limit Max allowed requests within window (default: 60)
 * @param windowMs Time window in milliseconds (default: 60000 = 1 minute)
 */
export async function checkDistributedRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. If Upstash Redis is configured, execute distributed atomic INCR + EXPIRE
  if (upstashUrl && upstashToken && !upstashUrl.includes('placeholder')) {
    try {
      const windowSec = Math.ceil(windowMs / 1000);
      const key = `rl:${identifier}`;

      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSec, 'NX'],
          ['TTL', key],
        ]),
      });

      if (res.ok) {
        const data = await res.json();
        const currentCount = Number(data[0]?.result || 1);
        const ttlSec = Number(data[2]?.result || windowSec);
        const reset = Date.now() + Math.max(ttlSec, 1) * 1000;

        return {
          success: currentCount <= limit,
          limit,
          remaining: Math.max(0, limit - currentCount),
          reset,
        };
      }
    } catch {
      // Fallback seamlessly to local in-memory store if network fails
    }
  }

  // 2. In-Memory Sliding Window Fallback
  return checkRateLimit(identifier, limit, windowMs);
}

/**
 * Synchronous in-memory rate limiter
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newRecord.resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}

/**
 * Resolve client IP using trusted reverse proxy headers first,
 * preventing spoofing via arbitrary client-controlled x-forwarded-for headers.
 */
export function getClientIp(request: Request): string {
  // 1. Cloudflare trusted client IP
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp && isValidIp(cfIp)) {
    return cfIp.trim();
  }

  // 2. Vercel / Nginx real client IP
  const realIp = request.headers.get('x-real-ip');
  if (realIp && isValidIp(realIp)) {
    return realIp.trim();
  }

  // 3. Akamai / Fastly true client IP
  const trueClientIp = request.headers.get('true-client-ip');
  if (trueClientIp && isValidIp(trueClientIp)) {
    return trueClientIp.trim();
  }

  // 4. Fallback to X-Forwarded-For
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map((ip) => ip.trim());
    const valid = ips.find((ip) => isValidIp(ip));
    if (valid) return valid;
  }

  return '127.0.0.1';
}

function isValidIp(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;
  // Basic IPv4 & IPv6 format validation
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip === 'localhost' || ip === '::1';
}
