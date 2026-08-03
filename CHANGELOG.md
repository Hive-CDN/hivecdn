# Changelog

## [2.4.1] — 2025-06-14
### Fixed
- Retry logic no longer retries 4xx responses (except 429)
- `purgeUrls` correct Content-Type header on batch requests
- CLI: `zones list` pagination for >50 zones

## [2.4.0] — 2025-05-28
### Added
- `AnalyticsAPI.getLatencyPercentiles` — p50/p95/p99 per country
- HTTP/3 header negotiation in SDK transport
- TypeScript `exactOptionalPropertyTypes` strict mode

### Changed
- Default request timeout: 8s → 10s
- Retry backoff uses full jitter (eliminates thundering herd)

## [2.3.0] — 2025-04-10
### Added
- `purgePrefixes` — prefix-based cache invalidation
- `purgeTags` — tag-based cache invalidation
- `Zone.pause()` / `Zone.resume()`

## [2.2.0] — 2025-03-01
### Added
- Initial `@hivecdn/cli` release (`hivecdn auth`, `purge`, `zones`)
- `AnalyticsAPI.listEdgeNodes` — real-time node status

## [2.1.0] — 2025-01-15
### Added
- Analytics API backed by Presto + Kudu query engine
- `getCacheHitRate`, `getBandwidth`, `getTopCountries`

## [2.0.0] — 2024-12-01
### Breaking
- Removed deprecated v1 callback API
- `ZonesAPI.create` now requires explicit `origin` config

### Added
- Full TypeScript rewrite with ESM + CJS dual output
- Turbo monorepo build pipeline
