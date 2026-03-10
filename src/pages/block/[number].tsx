import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { theme } from '@/styles/theme';
import { useEthereum } from '@/contexts/EthereumContext';
import { getBlockById } from '@/lib/ethereum';
import { queryKeys } from '@/lib/queryKeys';
import {
  formatBlockNumber,
  formatRelativeTime,
  formatTimestamp,
  formatAddress,
  shortenHash,
} from '@/lib/format';

const PageTitle = styled.h1`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 400;
  color: ${theme.colors.link};
  margin: 0 0 ${theme.spacing.xl};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
  word-break: break-all;
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 ${theme.spacing.md};
  font-weight: 500;
`;

const TxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TxRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 4px;
  transition: background 0.1s ease;

  &:hover {
    background: ${theme.colors.codeBackground};
  }
`;

const TxLink = styled(Link)`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.link};
`;

const ErrorMsg = styled.div`
  color: ${theme.colors.txReverted};
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  padding: ${theme.spacing.xl};
  border: 1px solid ${theme.colors.txReverted};
  border-radius: 8px;
  opacity: 0.8;
`;

const Skeleton = styled.div`
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  height: 200px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

const NavRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
`;

const NavLink = styled(Link)`
  color: ${theme.colors.link};

  &:hover {
    opacity: 0.8;
  }
`;

export default function BlockPage() {
  const router = useRouter();
  const { number } = router.query;
  const { client } = useEthereum();

  const blockId = typeof number === 'string' ? number : '';

  const {
    data: block,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.block(blockId),
    queryFn: () => getBlockById(client, blockId),
    enabled: !!blockId,
  });

  const blockNum = block ? Number(block.number) : NaN;

  const gasUsedPct =
    block && block.gasLimit !== '0'
      ? Math.round((Number(block.gasUsed) / Number(block.gasLimit)) * 100)
      : 0;

  return (
    <Layout title={`block ${blockId} · shatter`}>
      {block && (
        <NavRow>
          <NavLink href={`/block/${blockNum - 1}`}>
            ← {formatBlockNumber(String(blockNum - 1))}
          </NavLink>
          <span style={{ color: theme.colors.textSecondary }}>·</span>
          <NavLink href={`/block/${blockNum + 1}`}>
            {formatBlockNumber(String(blockNum + 1))} →
          </NavLink>
        </NavRow>
      )}

      <PageTitle>{formatBlockNumber(blockId)}</PageTitle>

      {isLoading && <Skeleton />}
      {isError && (
        <ErrorMsg>
          failed to load block: {error instanceof Error ? error.message : 'unknown error'}
        </ErrorMsg>
      )}

      {block && (
        <>
          <DetailGrid>
            <DetailItem>
              <DetailLabel>timestamp</DetailLabel>
              <DetailValue>
                {formatTimestamp(block.timestamp)} ({formatRelativeTime(block.timestamp)})
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>transactions</DetailLabel>
              <DetailValue>{block.transactionCount.toLocaleString()}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>miner</DetailLabel>
              <DetailValue>
                <Link href={`/address/${block.miner}`} style={{ color: theme.colors.link }}>
                  {formatAddress(block.miner)}
                </Link>
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>gas used</DetailLabel>
              <DetailValue>
                {Number(block.gasUsed).toLocaleString()} ({gasUsedPct}%)
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>gas limit</DetailLabel>
              <DetailValue>{Number(block.gasLimit).toLocaleString()}</DetailValue>
            </DetailItem>
            {block.baseFeePerGas && (
              <DetailItem>
                <DetailLabel>base fee</DetailLabel>
                <DetailValue>
                  {(Number(BigInt(block.baseFeePerGas)) / 1e9).toFixed(2)} Gwei
                </DetailValue>
              </DetailItem>
            )}
            <DetailItem>
              <DetailLabel>hash</DetailLabel>
              <DetailValue style={{ fontSize: theme.fontSizes.xs }}>{block.hash}</DetailValue>
            </DetailItem>
          </DetailGrid>

          {block.transactionHashes.length > 0 && (
            <div>
              <SectionTitle>transactions ({block.transactionHashes.length})</SectionTitle>
              <TxList>
                {block.transactionHashes.slice(0, 50).map((hash) => (
                  <TxRow key={hash}>
                    <TxLink href={`/tx/${hash}`}>{shortenHash(hash)}</TxLink>
                  </TxRow>
                ))}
                {block.transactionHashes.length > 50 && (
                  <div
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: theme.fontSizes.xs,
                      fontFamily: theme.fonts.mono,
                      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    }}
                  >
                    + {block.transactionHashes.length - 50} more
                  </div>
                )}
              </TxList>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
