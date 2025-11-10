/**
 * Client-side rate limiter to prevent exceeding backend rate limits
 * Implements token bucket algorithm with exponential backoff for 429 errors
 */

class RateLimiter {
  constructor(options = {}) {
    // Rate limit configuration
    this.requestsPerSecond = options.requestsPerSecond || 10;
    this.requestsPerMinute = options.requestsPerMinute || 300;
    this.burstSize = options.burstSize || this.requestsPerSecond * 2;

    // Tracking
    this.tokens = this.burstSize;
    this.lastRefillTime = Date.now();
    this.requestTimestamps = [];
    this.blockedUntil = 0;

    // Backoff configuration
    this.initialBackoffMs = options.initialBackoffMs || 1000;
    this.maxBackoffMs = options.maxBackoffMs || 32000;
    this.backoffMultiplier = options.backoffMultiplier || 2;
    this.currentBackoffMs = this.initialBackoffMs;

    // Callback for when rate limit is hit
    this.onRateLimitHit = options.onRateLimitHit || (() => {});
  }

  /**
   * Refill tokens based on elapsed time
   */
  refillTokens() {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = elapsedSeconds * this.requestsPerSecond;

    this.tokens = Math.min(this.burstSize, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  /**
   * Check if request can be made according to per-second rate limit
   */
  canMakeRequest() {
    // Check if we're in backoff period from 429 error
    const now = Date.now();
    if (now < this.blockedUntil) {
      return false;
    }

    // Refill tokens
    this.refillTokens();

    // Token bucket check
    if (this.tokens >= 1) {
      return true;
    }

    return false;
  }

  /**
   * Check per-minute rate limit
   */
  checkPerMinuteLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Remove timestamps older than 1 minute
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => timestamp > oneMinuteAgo
    );

    // Check if we've exceeded per-minute limit
    if (this.requestTimestamps.length >= this.requestsPerMinute) {
      return false;
    }

    return true;
  }

  /**
   * Record a request
   */
  recordRequest() {
    this.tokens = Math.max(0, this.tokens - 1);
    this.requestTimestamps.push(Date.now());
  }

  /**
   * Handle rate limit error (429)
   */
  handleRateLimitError() {
    const now = Date.now();
    this.blockedUntil = now + this.currentBackoffMs;
    this.currentBackoffMs = Math.min(
      this.maxBackoffMs,
      this.currentBackoffMs * this.backoffMultiplier
    );
    this.onRateLimitHit(this.currentBackoffMs);
  }

  /**
   * Reset backoff (called on successful request)
   */
  resetBackoff() {
    this.currentBackoffMs = this.initialBackoffMs;
  }

  /**
   * Wait until a request can be made
   * Returns the wait time in milliseconds
   */
  async waitUntilReady() {
    const now = Date.now();

    // Check backoff period
    if (now < this.blockedUntil) {
      const waitTime = this.blockedUntil - now;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return waitTime;
    }

    // Refill and check tokens
    this.refillTokens();

    if (this.tokens < 1) {
      const waitTime = (1 - this.tokens) / this.requestsPerSecond * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.refillTokens();
      return waitTime;
    }

    return 0;
  }

  /**
   * Get current rate limit status
   */
  getStatus() {
    return {
      tokensAvailable: this.tokens,
      burstSize: this.burstSize,
      requestsPerSecond: this.requestsPerSecond,
      requestsPerMinute: this.requestsPerMinute,
      recentRequestCount: this.requestTimestamps.filter(
        (t) => t > Date.now() - 60000
      ).length,
      isBlocked: Date.now() < this.blockedUntil,
      blockedUntilMs: Math.max(0, this.blockedUntil - Date.now()),
      currentBackoffMs: this.currentBackoffMs,
    };
  }
}

// Create singleton instance
const globalRateLimiter = new RateLimiter();

export { RateLimiter, globalRateLimiter };
