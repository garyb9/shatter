import type { SiteConfig, NavLinkArray } from './types';

export const SITE_CONFIG: SiteConfig = {
  name: 'shatter',
  description: 'a visual blockchain explorer',
  url: 'https://shatter.xyz',
};

export const NAV_LINKS: NavLinkArray = [{ href: '/explore', label: 'explore' }];

export const MOBILE_BREAKPOINT = 768;

// Public RPC — override with NEXT_PUBLIC_RPC_URL env var
export const DEFAULT_RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ?? 'https://eth-mainnet.g.alchemy.com/v2/demo';

export const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api';
export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? '';

export const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
] as const;

// ~1 Ethereum block time
export const LIVE_FEED_POLL_INTERVAL_MS = 12_000;

export const LIVE_FEED_BLOCK_COUNT = 10;
