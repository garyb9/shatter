import type { SearchResult, SearchInputType } from './types';

export function classifySearchInput(input: string): SearchResult {
  const trimmed = input.trim();

  // Ethereum tx hash: 0x + 64 hex chars
  if (/^0x[0-9a-fA-F]{64}$/.test(trimmed)) {
    return { inputType: 'tx', value: trimmed, route: `/tx/${trimmed}` };
  }

  // Ethereum address: 0x + 40 hex chars
  if (/^0x[0-9a-fA-F]{40}$/.test(trimmed)) {
    return { inputType: 'address', value: trimmed, route: `/address/${trimmed}` };
  }

  // Block number: pure integer
  if (/^\d+$/.test(trimmed)) {
    return { inputType: 'block', value: trimmed, route: `/block/${trimmed}` };
  }

  // ENS name: ends in .eth
  if (trimmed.endsWith('.eth')) {
    return { inputType: 'ens', value: trimmed, route: `/address/${trimmed}` };
  }

  // IPFS CID v0 (Qm...) or v1 (bafy...)
  if (/^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-zA-Z2-7]+)/.test(trimmed)) {
    return { inputType: 'cid', value: trimmed, route: `/ipfs/${trimmed}` };
  }

  return {
    inputType: 'unknown' as SearchInputType,
    value: trimmed,
    route: `/explore?q=${encodeURIComponent(trimmed)}`,
  };
}
