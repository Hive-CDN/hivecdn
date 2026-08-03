import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HiveCDN } from '../client.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const ZONE = 'zone_01HXCJK2T8P3N7QR5V6WB0Y4MF';
const KEY  = 'hcdn_test_k3y_abc123xyz';

const ok = (body: unknown, status = 200) =>
  mockFetch.mockResolvedValueOnce({
    ok: status < 400, status,
    headers: { get: () => null },
    json: async () => body,
  });

describe('CacheAPI', () => {
  let cdn: HiveCDN;
  beforeEach(() => { cdn = new HiveCDN({ apiKey: KEY }); vi.clearAllMocks(); });

  it('purgeUrls sends correct payload', async () => {
    ok({ id: 'p1', status: 'queued', targets: 2, purgedAt: '2025-06-01T00:00:00Z' });
    const r = await cdn.cache.purgeUrls(ZONE, ['https://x.com/a.jpg', 'https://x.com/b.png']);
    expect(r.status).toBe('queued');
    const body = JSON.parse(mockFetch.mock.calls[0]![2].body as string);
    expect(body.targets.type).toBe('files');
    expect(body.targets.urls).toHaveLength(2);
  });

  it('rejects empty URL list', async () => {
    await expect(cdn.cache.purgeUrls(ZONE, [])).rejects.toThrow('At least one URL');
  });

  it('rejects > 500 URLs', async () => {
    await expect(cdn.cache.purgeUrls(ZONE, Array(501).fill('https://x.com/'))).rejects.toThrow('Maximum 500');
  });

  it('purgeEverything sends correct type', async () => {
    ok({ id: 'p2', status: 'queued', targets: -1, purgedAt: '2025-06-01T00:00:00Z' });
    await cdn.cache.purgeEverything(ZONE);
    const body = JSON.parse(mockFetch.mock.calls[0]![2].body as string);
    expect(body.targets.type).toBe('everything');
  });
});

describe('HiveCDN constructor', () => {
  it('throws without apiKey', () => {
    expect(() => new HiveCDN({ apiKey: '' })).toThrow('apiKey is required');
  });
});
