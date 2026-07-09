/**
 * Simple in-memory rate limiter.
 * Catatan: Jika di-deploy ke Serverless/Edge (seperti Vercel), in-memory state tidak 
 * dibagikan antar instance (isolate). Namun ini masih efektif untuk mengurangi 
 * brute-force beruntun pada instance yang sama.
 * Untuk skala Enterprise sungguhan, sebaiknya gunakan Redis (seperti Upstash Rate Limiter).
 */

interface RateLimitTracker {
  count: number;
  resetAt: number;
}

const rateLimiters = new Map<string, RateLimitTracker>();

export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): { success: boolean; limit: number; remaining: number; resetAt: number } {
  const now = Date.now();
  
  // Bersihkan key yang kadaluwarsa (opsional, untuk mencegah memory leak)
  if (rateLimiters.size > 1000) {
    for (const [key, tracker] of rateLimiters.entries()) {
      if (tracker.resetAt < now) {
        rateLimiters.delete(key);
      }
    }
  }

  const tracker = rateLimiters.get(identifier);

  if (!tracker) {
    const resetAt = now + windowSeconds * 1000;
    rateLimiters.set(identifier, { count: 1, resetAt });
    return { success: true, limit, remaining: limit - 1, resetAt };
  }

  if (now > tracker.resetAt) {
    const resetAt = now + windowSeconds * 1000;
    rateLimiters.set(identifier, { count: 1, resetAt });
    return { success: true, limit, remaining: limit - 1, resetAt };
  }

  if (tracker.count >= limit) {
    return { success: false, limit, remaining: 0, resetAt: tracker.resetAt };
  }

  tracker.count += 1;
  return { success: true, limit, remaining: limit - tracker.count, resetAt: tracker.resetAt };
}
