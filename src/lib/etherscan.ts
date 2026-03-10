import { ETHERSCAN_BASE_URL, ETHERSCAN_API_KEY } from './consts';
import type { TransactionSummary, TokenTransfer } from './types';

interface EtherscanTx {
  hash: string;
  blockNumber: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  input: string;
  txreceipt_status: string;
  timeStamp: string;
}

interface EtherscanTokenTransfer {
  hash: string;
  blockNumber: string;
  from: string;
  to: string;
  contractAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimal: string;
  value: string;
  timeStamp: string;
  tokenID?: string;
}

function buildUrl(params: Record<string, string>): string {
  const url = new URL(ETHERSCAN_BASE_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  if (ETHERSCAN_API_KEY) url.searchParams.set('apikey', ETHERSCAN_API_KEY);
  return url.toString();
}

export async function getAddressTxHistory(
  address: string,
  page = 1,
  offset = 25
): Promise<TransactionSummary[]> {
  const url = buildUrl({
    module: 'account',
    action: 'txlist',
    address,
    page: String(page),
    offset: String(offset),
    sort: 'desc',
  });

  const res = await fetch(url);
  const data = (await res.json()) as { status: string; message: string; result: EtherscanTx[] };

  if (data.status !== '1') {
    if (data.message === 'No transactions found') return [];
    throw new Error(`Etherscan error: ${data.message}`);
  }

  return data.result.map(
    (tx): TransactionSummary => ({
      hash: tx.hash as `0x${string}`,
      blockNumber: tx.blockNumber,
      from: tx.from as `0x${string}`,
      to: tx.to ? (tx.to as `0x${string}`) : null,
      value: tx.value,
      gasPrice: tx.gasPrice,
      input: tx.input as `0x${string}`,
      status: tx.txreceipt_status === '1' ? 'success' : 'reverted',
      timestamp: tx.timeStamp,
    })
  );
}

export async function getTokenTransfers(
  address: string,
  page = 1,
  offset = 25
): Promise<TokenTransfer[]> {
  const url = buildUrl({
    module: 'account',
    action: 'tokentx',
    address,
    page: String(page),
    offset: String(offset),
    sort: 'desc',
  });

  const res = await fetch(url);
  const data = (await res.json()) as {
    status: string;
    message: string;
    result: EtherscanTokenTransfer[];
  };

  if (data.status !== '1') {
    if (data.message === 'No transactions found') return [];
    throw new Error(`Etherscan error: ${data.message}`);
  }

  return data.result.map(
    (tx): TokenTransfer => ({
      hash: tx.hash as `0x${string}`,
      blockNumber: tx.blockNumber,
      timestamp: tx.timeStamp,
      from: tx.from as `0x${string}`,
      to: tx.to as `0x${string}`,
      tokenAddress: tx.contractAddress as `0x${string}`,
      tokenSymbol: tx.tokenSymbol,
      tokenName: tx.tokenName,
      tokenDecimals: Number(tx.tokenDecimal),
      value: tx.value,
      tokenType: 'ERC20',
    })
  );
}

export async function getNFTTransfers(
  address: string,
  page = 1,
  offset = 25
): Promise<TokenTransfer[]> {
  const url = buildUrl({
    module: 'account',
    action: 'tokennfttx',
    address,
    page: String(page),
    offset: String(offset),
    sort: 'desc',
  });

  const res = await fetch(url);
  const data = (await res.json()) as {
    status: string;
    message: string;
    result: EtherscanTokenTransfer[];
  };

  if (data.status !== '1') {
    if (data.message === 'No transactions found') return [];
    throw new Error(`Etherscan error: ${data.message}`);
  }

  return data.result.map(
    (tx): TokenTransfer => ({
      hash: tx.hash as `0x${string}`,
      blockNumber: tx.blockNumber,
      timestamp: tx.timeStamp,
      from: tx.from as `0x${string}`,
      to: tx.to as `0x${string}`,
      tokenAddress: tx.contractAddress as `0x${string}`,
      tokenSymbol: tx.tokenSymbol,
      tokenName: tx.tokenName,
      tokenDecimals: 0,
      value: '1',
      tokenType: 'ERC721',
      tokenId: tx.tokenID,
    })
  );
}
