import type { HiveCDNHttpClient } from './http.js';
import type { Zone, OriginConfig, CacheConfig } from './types.js';

export class ZonesAPI {
  constructor(private readonly http: HiveCDNHttpClient) {}

  async list(): Promise<Zone[]> {
    const res = await this.http.request<{ zones: Zone[] }>('GET', '/zones');
    return res.zones;
  }

  async get(zoneId: string): Promise<Zone> {
    return this.http.request<Zone>('GET', `/zones/${zoneId}`);
  }

  async create(options: {
    name: string;
    origin: OriginConfig;
    cache?: Partial<CacheConfig>;
  }): Promise<Zone> {
    return this.http.request<Zone>('POST', '/zones', options);
  }

  async updateOrigin(zoneId: string, origin: Partial<OriginConfig>): Promise<Zone> {
    return this.http.request<Zone>('PATCH', `/zones/${zoneId}/origin`, origin);
  }

  async updateCache(zoneId: string, cache: Partial<CacheConfig>): Promise<Zone> {
    return this.http.request<Zone>('PATCH', `/zones/${zoneId}/cache`, cache);
  }

  async delete(zoneId: string): Promise<void> {
    await this.http.request<void>('DELETE', `/zones/${zoneId}`);
  }

  async pause(zoneId: string): Promise<Zone> {
    return this.http.request<Zone>('POST', `/zones/${zoneId}/pause`);
  }

  async resume(zoneId: string): Promise<Zone> {
    return this.http.request<Zone>('POST', `/zones/${zoneId}/resume`);
  }
}
