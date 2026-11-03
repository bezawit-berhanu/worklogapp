/**
 * TiDB Client Service Wrapper
 * Handles querying, retry backoff, and graceful local fallbacks.
 */
export interface QueryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  isFallback?: boolean;
}

export class TiDBClient {
  private maxRetries: number;
  private retryDelayMs: number;

  constructor(maxRetries = 3, retryDelayMs = 500) {
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;
  }

  /**
   * Execute an asynchronous database operation with exponential retry backoff
   */
  async executeWithRetry<T>(operation: () => Promise<T>): Promise<QueryResult<T>> {
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
        // Wait exponential backoff
        await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs * Math.pow(2, attempts - 1)));
      }
    }

    return { success: false, error: 'Unknown execution error' };
  }
}

export const tidbClient = new TiDBClient();
