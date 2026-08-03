import Conf from 'conf';
import type { HiveCDNConfig } from '@hivecdn/sdk';

interface CLIProfile {
  apiKey: string;
  baseUrl?: string;
  defaultZoneId?: string;
}

interface CLIStore {
  activeProfile: string;
  profiles: Record<string, CLIProfile>;
}

const store = new Conf<CLIStore>({
  projectName: 'hivecdn',
  defaults: {
    activeProfile: 'default',
    profiles: {},
  },
});

export function getActiveProfile(): CLIProfile | null {
  const name = store.get('activeProfile');
  return store.get(`profiles.${name}`) ?? null;
}

export function saveProfile(name: string, profile: CLIProfile): void {
  store.set(`profiles.${name}`, profile);
  store.set('activeProfile', name);
}

export function getSDKConfig(): HiveCDNConfig {
  const profile = getActiveProfile();
  const apiKey = process.env['HIVECDN_API_KEY'] ?? profile?.apiKey;
  if (!apiKey) {
    throw new Error(
      'No API key found. Run `hivecdn auth login` or set HIVECDN_API_KEY.',
    );
  }
  return { apiKey, baseUrl: profile?.baseUrl };
}
