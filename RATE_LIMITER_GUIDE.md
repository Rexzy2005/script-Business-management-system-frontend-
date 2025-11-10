# Rate Limiter Implementation Guide

## Overview

A client-side rate limiter has been added to prevent exceeding the backend API's rate limits. The implementation includes:

- **Token bucket algorithm** for managing request rates
- **Exponential backoff** for handling 429 (Too Many Requests) responses
- **Per-second and per-minute rate limiting** to prevent abuse
- **Automatic retry logic** with configurable maximum retries
- **User-facing warnings** when rate limits are active

## How It Works

### Rate Limiting Strategy

The rate limiter uses a token bucket algorithm:

1. **Tokens Refill**: Tokens are continuously refilled at a configurable rate (default: 10 requests/second)
2. **Burst Allowance**: Up to 2x the per-second rate can be burst (default: 20 requests burst)
3. **Per-Minute Cap**: Maximum of 300 requests per minute regardless of burst rate
4. **Token Consumption**: Each successful request consumes 1 token

### 429 Error Handling

When the backend returns a 429 (Too Many Requests) response:

1. **Backoff Activation**: Client enters exponential backoff period
2. **Automatic Retry**: Requests are automatically retried (max 3 retries by default)
3. **Exponential Increase**: Backoff time doubles each retry (1s → 2s → 4s → 8s, up to 32s max)
4. **User Notification**: A warning appears showing remaining wait time

## Configuration

### Default Settings

```javascript
// client/lib/rateLimiter.js
const limiter = new RateLimiter({
  requestsPerSecond: 10,        // Token refill rate
  requestsPerMinute: 300,       // Hard limit per minute
  burstSize: 20,                // Max burst requests
  initialBackoffMs: 1000,       // Initial 429 backoff (1 second)
  maxBackoffMs: 32000,          // Max backoff time (32 seconds)
  backoffMultiplier: 2,         // Exponential backoff multiplier
});
```

### Custom Configuration

To modify rate limiting behavior, update the `RateLimiter` instantiation in `client/lib/rateLimiter.js`:

```javascript
const globalRateLimiter = new RateLimiter({
  requestsPerSecond: 5,         // Lower to be more conservative
  requestsPerMinute: 200,       // Stricter per-minute limit
  initialBackoffMs: 2000,       // Wait longer before retry
});
```

## API Usage

### Automatic Rate Limiting

Rate limiting is **automatically applied** to all API calls through the existing `apiCall()` function:

```javascript
// client/lib/api.js
import { apiGet, apiPost, apiPut, apiDelete } from './lib/api';

// These calls are automatically rate limited
const data = await apiGet('/api/users');
const response = await apiPost('/api/register', userData);
```

### Custom Max Retries

Override max retries per request:

```javascript
const response = await apiCall('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify(data),
  maxRetries: 5,  // Retry up to 5 times instead of default 3
});
```

## Using the Rate Limiter Hook

### useRateLimiter Hook

Access rate limiter status in components:

```javascript
import { useRateLimiter } from '../hooks/useRateLimiter';

function MyComponent() {
  const { isLimited, status, getRemainingTime } = useRateLimiter();

  return (
    <div>
      <p>Requests this minute: {status.recentRequestCount}/{status.requestsPerMinute}</p>
      <p>Rate limited: {isLimited ? 'Yes' : 'No'}</p>
      {isLimited && <p>Wait {getRemainingTime()}s</p>}
    </div>
  );
}
```

### Hook Return Values

- **isLimited** (boolean): Whether currently in rate limit backoff period
- **status** (object): Current rate limiter state
  - `tokensAvailable`: Number of available tokens
  - `burstSize`: Maximum burst size
  - `requestsPerSecond`: Token refill rate
  - `requestsPerMinute`: Hard limit per minute
  - `recentRequestCount`: Requests in last 60 seconds
  - `isBlocked`: Whether blocked until next request
  - `blockedUntilMs`: Milliseconds until unblocked
  - `currentBackoffMs`: Current exponential backoff time
- **lastLimitedTime** (Date): When rate limiting was last triggered
- **getRemainingTime()** (function): Get remaining seconds in backoff period

## UI Components

### RateLimitWarning Component

Displays a warning banner when rate limit is active:

```javascript
import { RateLimitWarning } from '@/components/RateLimitWarning';

// Already included in App.jsx - visible globally
// Shows: "Rate Limit Active - Please wait X seconds"
```

The component is automatically included in the main App and displays:
- Alert icon and title
- Remaining wait time
- Request count statistics

## Best Practices

1. **Don't Override Defaults Unless Needed**: Default settings balance usability and safety

2. **Monitor Rate Limit Status**: In high-traffic components, check status before making requests:
   ```javascript
   const { status } = useRateLimiter();
   if (status.recentRequestCount > 200) {
     // Suggest user wait or batch requests
   }
   ```

3. **Batch Requests**: When possible, combine multiple requests into one to save tokens:
   ```javascript
   // Bad: 3 separate requests
   const user = await apiGet('/api/user');
   const posts = await apiGet('/api/posts');
   const settings = await apiGet('/api/settings');

   // Better: 1 request (if backend supports it)
   const data = await apiGet('/api/user/bundle');
   ```

4. **Handle Rate Limiting Gracefully**: Show users helpful messages:
   ```javascript
   try {
     const data = await apiGet('/api/endpoint');
   } catch (error) {
     if (error.message.includes('Too many requests')) {
       // Show: "Please wait a moment before trying again"
     }
   }
   ```

5. **Disable for Development**: To test without rate limiting, temporarily modify `client/lib/api.js`:
   ```javascript
   // Comment out rate limit check for testing
   // if (!globalRateLimiter.canMakeRequest()) {
   //   await globalRateLimiter.waitUntilReady();
   // }
   ```

## Debugging

### Check Rate Limiter Status

In browser console:

```javascript
import { globalRateLimiter } from './client/lib/rateLimiter.js';

// View current status
console.log(globalRateLimiter.getStatus());

// Manually trigger rate limit (for testing)
globalRateLimiter.handleRateLimitError();

// Reset rate limiter state
globalRateLimiter.currentBackoffMs = globalRateLimiter.initialBackoffMs;
globalRateLimiter.blockedUntil = 0;
```

### Console Logs

The implementation logs:
- `Rate limiter: waited Xms before request` - Token bucket wait time
- `Rate limited (429) on /endpoint. Retrying in Xms` - Automatic retries
- `Rate limit exceeded: X/Y requests` - Per-minute limit exceeded

## Architecture

### File Structure

```
client/
├── lib/
│   ├── api.js                 # API calls with rate limiting
│   ├── rateLimiter.js         # Rate limiter implementation
│   └── ...
├── hooks/
│   ├── useRateLimiter.js      # React hook for rate limiter
│   └── ...
├── components/
│   ├── RateLimitWarning.jsx   # User-facing warning component
│   └── ...
└── App.jsx                    # Global RateLimitWarning included
```

### Integration Points

1. **API Layer** (`client/lib/api.js`): Enforces rate limits on all requests
2. **React Hook** (`client/hooks/useRateLimiter.js`): Provides component access
3. **UI Component** (`client/components/RateLimitWarning.jsx`): Shows user warnings
4. **App Root** (`client/App.jsx`): Renders warning globally

## Performance Impact

- **Memory**: ~2KB per rate limiter instance (tracking ~60s of timestamps)
- **CPU**: Negligible - token refill is O(1), request tracking is O(n) where n ≤ requests per minute
- **Network**: Reduces unnecessary failed requests, improving overall performance

## Testing

### Simulate Rate Limiting

```javascript
// In browser console
import { globalRateLimiter } from './client/lib/rateLimiter.js';

// Force rate limit
globalRateLimiter.blockedUntil = Date.now() + 5000;

// Make request - should wait 5 seconds
fetch('/api/endpoint');
```

### Simulate 429 Response

Modify a request to trigger retry logic:

```javascript
// Temporarily modify API endpoint to return 429
// Or use browser DevTools to manually return 429 response
```

## Troubleshooting

### "Rate limit exceeded" even with low traffic
- Check `requestsPerMinute` setting - might be too low
- Verify backend isn't returning 429 for other reasons
- Check for duplicate requests (double submissions)

### Users see "Rate Limit Active" but haven't made many requests
- Another user/tab might be hitting the rate limit
- Backend might have per-IP rate limits
- Consider increasing `burstSize` if legitimate traffic spikes occur

### Automatic retries aren't working
- Verify `maxRetries` isn't set to 0 in apiCall options
- Check browser console for error messages
- Ensure backend is actually returning 429 status code

## Future Improvements

Potential enhancements:

1. **Per-Endpoint Limits**: Different rates for different API endpoints
2. **Distributed Limiter**: Sync rate limit state across tabs
3. **Analytics**: Track rate limit hits and patterns
4. **Adaptive Limiting**: Automatically adjust based on API response patterns
5. **Queue System**: Queue requests when rate limited instead of failing
