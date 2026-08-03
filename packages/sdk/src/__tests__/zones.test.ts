import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HiveCDN } from '../client.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const KEY = 'hcdn_test_k3y_abc123xyz';

const ok = (body: unknown) =>
  mockFetch.mockResolvedValueOnce({
    ok: true, status: 200,
    headers: { get: () => null },
    json: async () => body,
  });

const zone = {
  id: 'zone_01HXCJK2T8P3N7QR5V6WB0Y4MF',
  name: 'example.com',
  status: 'active',
  plan: 'pro',
  origin: { url: 'https://origin.example.com', timeout: 30, followRedirects: true },
  cache: { defaultTtl: 86400, rules: [], bypassCookies: [], honorOriginHeaders: false },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-06-01T00:00:00Z',
};

describe('ZonesAPI', () => {
  let cdn: HiveCDN;
  beforeEach(() => { cdn = new HiveCDN({ apiKey: KEY }); vi.clearAllMocks(); });

  it('lists zones', async () => {
    ok({ zones: [zone] });
    const zones = await cdn.zones.list();
    expect(zones).toHaveLength(1);
    expect(zones[0]!.name).toBe('example.com');
  });

  it('gets a single zone', async () => {
    ok(zone);
    const z = await cdn.zones.get(zone.id);
    expect(z.id).toBe(zone.id);
    expect(z.status).toBe('active');
  });

  it('requests correct URL for get', async () => {
    ok(zone);
    await cdn.zones.get('zone_abc');
    const [, url] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/zones/zone_abc');
  });
});
