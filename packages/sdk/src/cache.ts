import type { HiveCDNHttpClient } from './http.js';
import type { PurgeOptions, PurgeResult } from './types.js';

export class CacheAPI {
  constructor(private readonly http: HiveCDNHttpClient) {}

  async purge(options: PurgeOptions): Promise<PurgeResult> {
    return this.http.request<PurgeResult>('POST', `/zones/${options.zoneId}/purge`, {
      targets: options.targets,
    });
  }

  async purgeEverything(zoneId: string): Promise<PurgeResult> {
    return this.purge({ zoneId, targets: { type: 'everything' } });
  }

  async purgeUrls(zoneId: string, urls: string[]): Promise<PurgeResult> {
    if (urls.length === 0) throw new Error('At least one URL is required');
    if (urls.length > 500) throw new Error('Maximum 500 URLs per purge request');
    return this.purge({ zoneId, targets: { type: 'files', urls } });
  }

  async purgeTags(zoneId: string, tags: string[]): Promise<PurgeResult> {
    return this.purge({ zoneId, targets: { type: 'tags', tags } });
  }

  async purgePrefixes(zoneId: string, prefixes: string[]): Promise<PurgeResult> {
    return this.purge({ zoneId, targets: { type: 'prefixes', prefixes } });
  }

  async getPurgeStatus(zoneId: string, purgeId: string): Promise<PurgeResult> {
    return this.http.request<PurgeResult>('GET', `/zones/${zoneId}/purge/${purgeId}`);
  }
}
