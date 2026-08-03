import type { HiveCDNHttpClient } from './http.js';
import type { AnalyticsQuery, AnalyticsResult, EdgeNode } from './types.js';

export class AnalyticsAPI {
  constructor(private readonly http: HiveCDNHttpClient) {}

  async query(q: AnalyticsQuery): Promise<AnalyticsResult> {
    return this.http.request<AnalyticsResult>('POST', '/analytics/query', q);
  }

  async getBandwidth(zoneId: string, from: string, to: string): Promise<AnalyticsResult> {
    return this.query({ zoneId, from, to, metrics: ['bandwidth', 'requests', 'originBandwidth'], dimensions: ['datacenter'] });
  }

  async getCacheHitRate(zoneId: string, from: string, to: string): Promise<AnalyticsResult> {
    return this.query({ zoneId, from, to, metrics: ['cacheHitRate', 'requests', 'originRequests'], dimensions: ['cacheStatus'] });
  }

  async getLatencyPercentiles(zoneId: string, from: string, to: string): Promise<AnalyticsResult> {
    return this.query({ zoneId, from, to, metrics: ['p50Latency', 'p95Latency', 'p99Latency'], dimensions: ['country'] });
  }

  async getTopCountries(zoneId: string, from: string, to: string, limit = 20): Promise<AnalyticsResult> {
    return this.query({ zoneId, from, to, metrics: ['requests', 'bandwidth', 'uniqueVisitors'], dimensions: ['country'], limit });
  }

  async listEdgeNodes(): Promise<EdgeNode[]> {
    const res = await this.http.request<{ nodes: EdgeNode[] }>('GET', '/network/nodes');
    return res.nodes;
  }
}
