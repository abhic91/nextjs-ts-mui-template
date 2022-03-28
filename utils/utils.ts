import { defaultThemeKey } from 'theme/themes.constants';
import whitelabel, { T_WhitelabelBusinessKeys } from 'whitelabel/whitelabel';

export const generateRandomId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const getWhitelabelKeyFromHostname = (host: string): T_WhitelabelBusinessKeys => {
  if (!host) return defaultThemeKey;
  const hostname = host.split(':')[0] || '';
  if (hostname.includes('keen') || hostname.includes('vercel')) return defaultThemeKey;
  return (Object.keys(whitelabel).find((key) => hostname.toLowerCase().includes(key.toLowerCase())) ||
    defaultThemeKey) as T_WhitelabelBusinessKeys;
};
