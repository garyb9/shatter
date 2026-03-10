export const queryKeys = {
  latestBlocks: (count: number) => ['blocks', 'latest', count] as const,
  block: (id: string) => ['block', id] as const,
  tx: (hash: string) => ['tx', hash] as const,
  address: (addr: string) => ['address', addr] as const,
  addressTxHistory: (addr: string, page: number) => ['address', addr, 'txs', page] as const,
  tokenTransfers: (addr: string) => ['address', addr, 'tokens'] as const,
  ipfs: (cid: string) => ['ipfs', cid] as const,
  ensResolve: (name: string) => ['ens', name] as const,
  gasHistory: (blockCount: number) => ['gas', 'history', blockCount] as const,
};
