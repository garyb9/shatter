// ─── Ethereum Core Types ──────────────────────────────────────────────────────

export interface BlockSummary {
  number: string; // bigint serialized as string
  hash: `0x${string}`;
  timestamp: string;
  transactionCount: number;
  gasUsed: string;
  gasLimit: string;
  baseFeePerGas: string | null;
  miner: `0x${string}`;
}

export interface TransactionSummary {
  hash: `0x${string}`;
  blockNumber: string;
  from: `0x${string}`;
  to: `0x${string}` | null; // null = contract creation
  value: string; // wei as string
  gasPrice: string | null;
  input: `0x${string}`;
  status: 'success' | 'reverted' | 'pending';
  timestamp?: string;
}

export interface TransactionLog {
  address: `0x${string}`;
  topics: readonly `0x${string}`[];
  data: `0x${string}`;
  logIndex: number;
}

export interface TransactionDetail extends TransactionSummary {
  gasUsed: string;
  effectiveGasPrice: string;
  logs: TransactionLog[];
  tokenTransfers: TokenTransfer[];
  isContractCreation: boolean;
}

export interface AddressInfo {
  address: `0x${string}`;
  ensName: string | null;
  balance: string; // wei as string
  txCount: number;
  isContract: boolean;
}

export interface TokenTransfer {
  hash: `0x${string}`;
  blockNumber: string;
  timestamp?: string;
  from: `0x${string}`;
  to: `0x${string}`;
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: number;
  value: string;
  tokenType: 'ERC20' | 'ERC721' | 'ERC1155';
  tokenId?: string;
}

// ─── IPFS Types ───────────────────────────────────────────────────────────────

export type IPFSContentType = 'markdown' | 'image' | 'json' | 'text' | 'binary' | 'unknown';

export interface IPFSContent {
  cid: string;
  contentType: IPFSContentType;
  mimeType: string;
  size?: number;
  raw?: string;
  imageUrl?: string;
  json?: unknown;
}

// ─── Site/Config Types ────────────────────────────────────────────────────────

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export type NavLinkArray = readonly NavLink[];

// ─── Search Types ─────────────────────────────────────────────────────────────

export type SearchInputType = 'address' | 'tx' | 'block' | 'ens' | 'cid' | 'unknown';

export interface SearchResult {
  inputType: SearchInputType;
  value: string;
  route: string;
}

// ─── Gas Types ────────────────────────────────────────────────────────────────

export interface GasDataPoint {
  blockNumber: string;
  baseFeePerGas: string | null;
  gasUsedRatio: number;
}
