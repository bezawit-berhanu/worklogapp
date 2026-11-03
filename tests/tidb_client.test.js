import test from 'node:test';
import assert from 'node:assert/strict';

class TiDBClient {
  constructor(maxRetries = 3, retryDelayMs = 10) {
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;
  }

  async executeWithRetry(operation) {
    let attempts = 0;
    while (attempts < this.maxRetries) {
      try {
        attempts++;
        const data = await operation();
        return { success: true, data };
      } catch (err) {
        if (attempts >= this.maxRetries) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            success: false,
            error: `Operation failed after ${attempts} attempts: ${message}`,
            isFallback: true,
          };
        }
        await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
      }
    }
    return { success: false, error: 'Unknown execution error' };
  }
}

test('TiDBClient executes operation successfully on first attempt', async () => {
  const client = new TiDBClient(3, 5);
  const result = await client.executeWithRetry(async () => ({ ping: 'pong' }));
  assert.equal(result.success, true);
  assert.deepEqual(result.data, { ping: 'pong' });
});

test('TiDBClient retries and recovers after transient errors', async () => {
  const client = new TiDBClient(3, 5);
  let callCount = 0;
  const result = await client.executeWithRetry(async () => {
    callCount++;
    if (callCount < 2) throw new Error('Transient connection reset');
    return { recovered: true };
  });

  assert.equal(result.success, true);
  assert.deepEqual(result.data, { recovered: true });
  assert.equal(callCount, 2);
});

test('TiDBClient reports graceful fallback when max retries exceeded', async () => {
  const client = new TiDBClient(2, 5);
  const result = await client.executeWithRetry(async () => {
    throw new Error('TiDB Cloud cluster unreachable');
  });

  assert.equal(result.success, false);
  assert.equal(result.isFallback, true);
  assert.ok(result.error.includes('Operation failed after 2 attempts'));
});
