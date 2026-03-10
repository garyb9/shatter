import { createPublicClient, http, type PublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import { DEFAULT_RPC_URL } from './consts';
import type { BlockSummary, TransactionDetail, AddressInfo, GasDataPoint } from './types';

export function createEthClient(rpcUrl = DEFAULT_RPC_URL): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl),
  });
}

function normalizeBlock(block: Awaited<ReturnType<PublicClient['getBlock']>>): BlockSummary {
  return {
    number: block.number?.toString() ?? '0',
    hash: block.hash ?? '0x0',
    timestamp: block.timestamp.toString(),
    transactionCount: block.transactions.length,
    gasUsed: block.gasUsed.toString(),
    gasLimit: block.gasLimit.toString(),
    baseFeePerGas: block.baseFeePerGas?.toString() ?? null,
    miner: block.miner,
  };
}

export async function getLatestBlocks(client: PublicClient, count = 10): Promise<BlockSummary[]> {
  const latest = await client.getBlockNumber();
  const blockNums = Array.from({ length: count }, (_, i) => latest - BigInt(i));
  const blocks = await Promise.all(blockNums.map((n) => client.getBlock({ blockNumber: n })));
  return blocks.map(normalizeBlock);
}

export async function getBlockById(
  client: PublicClient,
  numberOrHash: string
): Promise<BlockSummary & { transactionHashes: `0x${string}`[] }> {
  let block: Awaited<ReturnType<PublicClient['getBlock']>>;

  if (numberOrHash.startsWith('0x') && numberOrHash.length === 66) {
    block = await client.getBlock({ blockHash: numberOrHash as `0x${string}` });
  } else {
    block = await client.getBlock({ blockNumber: BigInt(numberOrHash) });
  }

  return {
    ...normalizeBlock(block),
    transactionHashes: block.transactions.filter((t): t is `0x${string}` => typeof t === 'string'),
  };
}

export async function getTransaction(
  client: PublicClient,
  hash: `0x${string}`
): Promise<TransactionDetail> {
  const [tx, receipt] = await Promise.all([
    client.getTransaction({ hash }),
    client.getTransactionReceipt({ hash }),
  ]);

  let timestamp: string | undefined;
  if (tx.blockNumber) {
    const block = await client.getBlock({ blockNumber: tx.blockNumber });
    timestamp = block.timestamp.toString();
  }

  return {
    hash: tx.hash,
    blockNumber: tx.blockNumber?.toString() ?? '0',
    from: tx.from,
    to: tx.to ?? null,
    value: tx.value.toString(),
    gasPrice: tx.gasPrice?.toString() ?? null,
    input: tx.input,
    status: receipt.status === 'success' ? 'success' : 'reverted',
    timestamp,
    gasUsed: receipt.gasUsed.toString(),
    effectiveGasPrice: receipt.effectiveGasPrice.toString(),
    logs: receipt.logs.map((log, i) => ({
      address: log.address,
      topics: log.topics,
      data: log.data,
      logIndex: i,
    })),
    tokenTransfers: [],
    isContractCreation: !tx.to,
  };
}

export async function getAddressInfo(
  client: PublicClient,
  address: `0x${string}`
): Promise<AddressInfo> {
  const [balance, txCount, code] = await Promise.all([
    client.getBalance({ address }),
    client.getTransactionCount({ address }),
    client.getBytecode({ address }),
  ]);

  let ensName: string | null = null;
  try {
    ensName = await client.getEnsName({ address });
  } catch {
    // ENS resolution is optional
  }

  return {
    address,
    ensName,
    balance: balance.toString(),
    txCount,
    isContract: !!code && code !== '0x',
  };
}

export async function resolveEns(
  client: PublicClient,
  name: string
): Promise<`0x${string}` | null> {
  try {
    return await client.getEnsAddress({ name });
  } catch {
    return null;
  }
}

export async function getGasHistory(
  client: PublicClient,
  blockCount = 20
): Promise<GasDataPoint[]> {
  const latest = await client.getBlockNumber();
  const blockNums = Array.from({ length: blockCount }, (_, i) => latest - BigInt(i)).reverse();

  const blocks = await Promise.all(blockNums.map((n) => client.getBlock({ blockNumber: n })));

  return blocks.map((b) => ({
    blockNumber: b.number?.toString() ?? '0',
    baseFeePerGas: b.baseFeePerGas?.toString() ?? null,
    gasUsedRatio: b.gasLimit > 0n ? Number((b.gasUsed * 100n) / b.gasLimit) / 100 : 0,
  }));
}
