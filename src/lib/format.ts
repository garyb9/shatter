export const formatAddress = (addr: string, chars = 6): string =>
  `${addr.slice(0, chars)}...${addr.slice(-4)}`;

export const formatEth = (wei: string, decimals = 6): string => {
  const eth = Number(BigInt(wei)) / 1e18;
  if (eth === 0) return '0 ETH';
  if (eth < 0.000001) return '< 0.000001 ETH';
  return `${eth.toFixed(decimals).replace(/\.?0+$/, '')} ETH`;
};

export const formatGwei = (wei: string): string => {
  const gwei = Number(BigInt(wei)) / 1e9;
  return `${gwei.toFixed(2)} Gwei`;
};

export const formatTimestamp = (unix: string): string => {
  const date = new Date(Number(unix) * 1000);
  return date.toLocaleString();
};

export const formatRelativeTime = (unix: string): string => {
  const seconds = Math.floor(Date.now() / 1000) - Number(unix);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const formatBlockNumber = (n: string): string => `#${Number(n).toLocaleString()}`;

export const formatTxType = (
  to: string | null,
  input: string
): 'value' | 'contract-call' | 'contract-create' => {
  if (!to) return 'contract-create';
  if (input && input !== '0x') return 'contract-call';
  return 'value';
};

export const formatTokenValue = (raw: string, decimals: number): string => {
  if (decimals === 0) return raw;
  const divisor = Math.pow(10, decimals);
  const value = Number(raw) / divisor;
  if (value < 0.0001) return '< 0.0001';
  return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

export const shortenHash = (hash: string): string => `${hash.slice(0, 10)}...${hash.slice(-6)}`;
