import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import TransactionFlow from '@/components/TransactionFlow';
import TokenTransfer from '@/components/TokenTransfer';
import { theme } from '@/styles/theme';
import { useEthereum } from '@/contexts/EthereumContext';
import { getTransaction } from '@/lib/ethereum';
import { getTokenTransfers } from '@/lib/etherscan';
import { queryKeys } from '@/lib/queryKeys';
import { shortenHash } from '@/lib/format';

const PageTitle = styled.h1`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xl};
  font-weight: 400;
  color: ${theme.colors.textSecondary};
  margin: 0 0 ${theme.spacing.xl};
  word-break: break-all;

  span {
    color: ${theme.colors.text};
  }
`;

const Section = styled.div`
  margin-top: ${theme.spacing.xl};
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

export default function TxPage() {
  const router = useRouter();
  const { hash } = router.query;
  const { client } = useEthereum();

  const hashStr = typeof hash === 'string' ? hash : '';

  const {
    data: tx,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.tx(hashStr),
    queryFn: () => getTransaction(client, hashStr as `0x${string}`),
    enabled: !!hashStr && hashStr.startsWith('0x'),
  });

  const { data: tokenTransfers } = useQuery({
    queryKey: queryKeys.tokenTransfers(hashStr),
    queryFn: () => getTokenTransfers(hashStr),
    enabled: !!tx,
  });

  const pageTitle = hashStr ? `tx ${shortenHash(hashStr)}` : 'transaction';

  return (
    <Layout title={`${pageTitle} · shatter`}>
      <PageTitle>
        tx <span>{hashStr}</span>
      </PageTitle>

      {isLoading && <Skeleton />}
      {isError && (
        <ErrorMsg>
          failed to load transaction: {error instanceof Error ? error.message : 'unknown error'}
        </ErrorMsg>
      )}
      {tx && <TransactionFlow tx={tx} />}

      {tokenTransfers && tokenTransfers.length > 0 && (
        <Section>
          <SectionTitle>token transfers ({tokenTransfers.length})</SectionTitle>
          {tokenTransfers.map((t) => (
            <TokenTransfer key={`${t.hash}-${t.tokenAddress}`} transfer={t} />
          ))}
        </Section>
      )}
    </Layout>
  );
}
