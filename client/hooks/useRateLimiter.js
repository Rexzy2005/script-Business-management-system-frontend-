import { useState, useEffect, useCallback } from "react";
import { globalRateLimiter } from "../lib/rateLimiter";

/**
 * Hook to track rate limiter status and display warnings to users
 */
export function useRateLimiter() {
  const [status, setStatus] = useState(() => globalRateLimiter.getStatus());
  const [isLimited, setIsLimited] = useState(false);
  const [lastLimitedTime, setLastLimitedTime] = useState(null);

  useEffect(() => {
    // Handle rate limit events
    const originalOnRateLimitHit = globalRateLimiter.onRateLimitHit;
    globalRateLimiter.onRateLimitHit = (backoffMs) => {
      setIsLimited(true);
      setLastLimitedTime(new Date());
      originalOnRateLimitHit?.(backoffMs);
    };

    // Update status periodically
    const interval = setInterval(() => {
      const newStatus = globalRateLimiter.getStatus();
      setStatus(newStatus);

      // Clear limited flag when backoff period ends
      if (isLimited && !newStatus.isBlocked) {
        setIsLimited(false);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      globalRateLimiter.onRateLimitHit = originalOnRateLimitHit;
    };
  }, [isLimited]);

  const getRemainingTime = useCallback(() => {
    const status = globalRateLimiter.getStatus();
    if (status.isBlocked) {
      return Math.ceil(status.blockedUntilMs / 1000);
    }
    return 0;
  }, []);

  return {
    status,
    isLimited,
    lastLimitedTime,
    getRemainingTime,
  };
}
