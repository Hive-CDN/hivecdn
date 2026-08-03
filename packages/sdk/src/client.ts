import { HiveCDNHttpClient } from './http.js';
import { ZonesAPI } from './zones.js';
import { CacheAPI } from './cache.js';
import { AnalyticsAPI } from './analytics.js';
import type { HiveCDNConfig } from './types.js';

/**
 * Main HiveCDN client. Instantiate once and reuse across requests.
 *
 * @example
 * ```ts
 * const cdn = new HiveCDN({ apiKey: process.env.HIVECDN_API_KEY! });
 * const zones = await cdn.zones.list();
 * await cdn.cache.purgeUrls(zones[0]!.id, ['https://example.com/logo.png']);
 * ```
 */
export class HiveCDN {
  readonly zones: ZonesAPI;
  readonly cache: CacheAPI;
  readonly analytics: AnalyticsAPI;
  private readonly http: HiveCDNHttpClient;

  constructor(config: HiveCDNConfig) {
    if (!config.apiKey) {
      throw new Error('HiveCDN: apiKey is required. Set HIVECDN_API_KEY or pass it explicitly.');
    }
    this.http = new HiveCDNHttpClient(config);
    this.zones = new ZonesAPI(this.http);
    this.cache = new CacheAPI(this.http);
    this.analytics = new AnalyticsAPI(this.http);
  }

  async whoami(): Promise<{ id: string; email: string; plan: string; zones: number }> {
    return this.http.request('GET', '/account');
  }
}
