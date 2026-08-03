/**
 * @hivecdn/sdk — Official HiveCDN JavaScript/TypeScript SDK
 *
 * @example
 * ```ts
 * import { HiveCDN } from '@hivecdn/sdk';
 *
 * const cdn = new HiveCDN({ apiKey: process.env.HIVECDN_API_KEY! });
 *
 * // List zones
 * const zones = await cdn.zones.list();
 *
 * // Purge cache by URL
 * await cdn.cache.purgeUrls(zones[0]!.id, ['https://example.com/image.png']);
 *
 * // Query analytics
 * const stats = await cdn.analytics.getCacheHitRate(zones[0]!.id, '2025-01-01', '2025-01-31');
 * ```
 */

export { HiveCDN } from './client.js';
export type {
  HiveCDNConfig,
  Zone,
  OriginConfig,
  CacheConfig,
  CacheRule,
  PurgeOptions,
  PurgeResult,
  AnalyticsQuery,
  AnalyticsResult,
  AnalyticsRow,
  AnalyticsMetric,
  AnalyticsDimension,
  EdgeNode,
  HiveCDNError,
} from './types.js';
