import Conf from 'conf';
import type { HiveCDNConfig } from '@hivecdn/sdk';

interface Profile {
  apiKey: string;
  baseUrl?: string;
}

interface Store {
  activeProfile: string;
  profiles: Record<string, Profile>;
}

const store = new Conf<Store>({
  projectName: 'hivecdn',
  defaults: { activeProfile: 'default', profiles: {} },
});

export function getActiveProfile(): Profile | null {
  return store.get(`profiles.${store.get('activeProfile')}`) ?? null;
}

export function saveProfile(name: string, profile: Profile): void {
  store.set(`profiles.${name}`, profile);
  store.set('activeProfile', name);
}

export function getSDKConfig(): HiveCDNConfig {
  const profile = getActiveProfile();
  const apiKey = process.env['HIVECDN_API_KEY'] ?? profile?.apiKey;
  if (!apiKey) throw new Error('No API key. Run `hivecdn auth login` or set HIVECDN_API_KEY.');
  return { apiKey, baseUrl: profile?.baseUrl };
}
