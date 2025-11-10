import { useState, useEffect } from "react";
import { useRateLimiter } from "../hooks/useRateLimiter";
import { AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * Component to display rate limit warnings to users
 */
export function RateLimitWarning({ className = "" }) {
  const { isLimited, status, getRemainingTime } = useRateLimiter();
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!isLimited) return;

    const interval = setInterval(() => {
      const remaining = getRemainingTime();
      setRemainingSeconds(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLimited, getRemainingTime]);

  if (!isLimited) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 max-w-sm rounded-lg border border-orange-200 bg-orange-50 p-4 shadow-lg dark:border-orange-900 dark:bg-orange-950",
        className
      )}
    >
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
        <div className="flex-1">
          <h3 className="font-semibold text-orange-900 dark:text-orange-100">
            Rate Limit Active
          </h3>
          <p className="mt-1 text-sm text-orange-800 dark:text-orange-200">
            Too many requests. Please wait {remainingSeconds}s before trying
            again.
          </p>
          <div className="mt-2 text-xs text-orange-700 dark:text-orange-300">
            <p>
              Requests in last minute:{" "}
              <span className="font-mono font-semibold">
                {status.recentRequestCount}/{status.requestsPerMinute}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
