/**
 * Core types for the HiveCDN SDK.
 * @module @hivecdn/sdk/types
 */

export interface HiveCDNConfig {
  apiKey: string;
  /** Defaults to 'https://api.hivecdn.xyz/v1' */
  baseUrl?: string;
  /** Request timeout in milliseconds. Default: 10_000 */
  timeout?: number;
  /** Max retries on transient failures. Default: 3 */
  maxRetries?: number;
}

export interface Zone {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'suspended';
  plan: 'free' | 'pro' | 'enterprise';
  origin: OriginConfig;
  cache: CacheConfig;
  createdAt: string;
  updatedAt: string;
}

export interface OriginConfig {
  url: string;
  timeout: number;
  followRedirects: boolean;
  headers?: Record<string, string>;
  healthCheck?: {
    path: string;
    interval: number;
    threshold: number;
  };
}

export interface CacheConfig {
  defaultTtl: number;
  rules: CacheRule[];
  bypassCookies: string[];
  honorOriginHeaders: boolean;
}

export interface CacheRule {
  match: { path?: string; extension?: string[]; method?: string[] };
  action: 'cache' | 'bypass' | 'no-store';
  ttl?: number;
  browserTtl?: number;
  edgeTtl?: number;
  revalidate?: 'stale-while-revalidate' | 'stale-if-error';
}

export interface PurgeOptions {
  zoneId: string;
  targets:
    | { type: 'everything' }
    | { type: 'files'; urls: string[] }
    | { type: 'tags'; tags: string[] }
    | { type: 'prefixes'; prefixes: string[] };
}

export interface PurgeResult {
  id: string;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  targets: number;
  purgedAt: string;
}

export type AnalyticsMetric =
  | 'requests'
  | 'bandwidth'
  | 'cacheHitRate'
  | 'originRequests'
  | 'originBandwidth'
  | 'p50Latency'
  | 'p95Latency'
  | 'p99Latency'
  | 'errorRate'
  | 'uniqueVisitors';

export type AnalyticsDimension =
  | 'country'
  | 'datacenter'
  | 'protocol'
  | 'httpStatus'
  | 'contentType'
  | 'cacheStatus';

export interface AnalyticsQuery {
  zoneId: string;
  from: string;
  to: string;
  metrics: AnalyticsMetric[];
  dimensions?: AnalyticsDimension[];
  limit?: number;
}

export interface AnalyticsResult {
  query: AnalyticsQuery;
  data: Array<{
    timestamp?: string;
    dimensions: Partial<Record<AnalyticsDimension, string>>;
    metrics: Partial<Record<AnalyticsMetric, number>>;
  }>;
  totals: Record<string, number>;
  meta: {
    executionTime: number;
    rowCount: number;
    prestoQueryId: string;
  };
}

export interface EdgeNode {
  id: string;
  name: string;
  city: string;
  country: string;
  region: 'NA' | 'EU' | 'APAC' | 'SA' | 'AF' | 'ME';
  lat: number;
  lon: number;
  status: 'online' | 'degraded' | 'offline';
  capacity: { bandwidthGbps: number; currentLoad: number };
}

export interface HiveCDNError extends Error {
  code: string;
  status?: number;
  requestId?: string;
}
