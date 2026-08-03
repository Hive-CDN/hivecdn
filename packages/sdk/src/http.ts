import type { HiveCDNConfig, HiveCDNError } from './types.js';

const DEFAULT_BASE_URL = 'https://api.hivecdn.xyz/v1';
const DEFAULT_TIMEOUT = 10_000;
const DEFAULT_MAX_RETRIES = 3;
const RETRY_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export class HiveCDNHttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;
  private readonly maxRetries: number;

  constructor(config: HiveCDNConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    let attempt = 0;

    while (attempt <= this.maxRetries) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);

      try {
        const res = await fetch(url, {
          method,
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'X-HiveCDN-SDK': '2.4.1',
          },
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });

        clearTimeout(timer);

        if (!res.ok) {
          if (RETRY_STATUS_CODES.has(res.status) && attempt < this.maxRetries) {
            const backoff = Math.min(1000 * 2 ** attempt + Math.random() * 200, 30_000);
            await sleep(backoff);
            attempt++;
            continue;
          }
          const payload = await res.json().catch(() => ({})) as Record<string, unknown>;
          const err = new Error(payload['message'] as string ?? `HTTP ${res.status}`) as HiveCDNError;
          err.code = payload['code'] as string ?? 'API_ERROR';
          err.status = res.status;
          err.requestId = res.headers.get('X-Request-ID') ?? undefined;
          throw err;
        }

        return (res.status === 204 ? {} : await res.json()) as T;
      } catch (err) {
        clearTimeout(timer);
        if ((err as Error).name === 'AbortError') {
          const e = new Error(`Request timed out after ${this.timeout}ms`) as HiveCDNError;
          e.code = 'REQUEST_TIMEOUT';
          throw e;
        }
        throw err;
      }
    }

    throw new Error('Unexpected retry loop exit');
  }
}
