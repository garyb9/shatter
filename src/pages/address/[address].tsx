import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import AddressCard from '@/components/AddressCard';
import TransactionCard from '@/components/TransactionCard';
import TokenTransfer from '@/components/TokenTransfer';
import { theme } from '@/styles/theme';
import { useEthereum } from '@/contexts/EthereumContext';
import { getAddressInfo, resolveEns } from '@/lib/ethereum';
import { getAddressTxHistory, getTokenTransfers } from '@/lib/etherscan';
import { queryKeys } from '@/lib/queryKeys';

const Section = styled.div`
  margin-top: ${theme.spacing['2xl']};
`;

const TabBar = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: 1px solid ${(p) => (p.$active ? theme.colors.link : theme.colors.border)};
  border-radius: 4px;
  color: ${(p) => (p.$active ? theme.colors.link : theme.colors.textSecondary)};
  cursor: pointer;
  font-size: ${theme.fontSizes.xs};
  padding: 4px 12px;
  font-family: ${theme.fonts.mono};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${theme.colors.link};
    color: ${theme.colors.link};
  }
`;

const PaginationRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  margin-top: ${theme.spacing.lg};
`;

const PageBtn = styled.button`
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${theme.colors.link};
    color: ${theme.colors.link};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
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
  height: 140px;
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

export default function AddressPage() {
  const router = useRouter();
  const { address } = router.query;
  const { client } = useEthereum();

  const [tab, setTab] = useState<'txns' | 'tokens'>('txns');
  const [page, setPage] = useState(1);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);

  const addrStr = typeof address === 'string' ? address : '';
  const isEns = addrStr.endsWith('.eth');
  const effectiveAddr = resolvedAddress ?? (isEns ? null : addrStr);

  // ENS resolution
  useEffect(() => {
    if (isEns && addrStr) {
      resolveEns(client, addrStr).then((resolved) => {
        if (resolved) setResolvedAddress(resolved);
      });
    }
  }, [isEns, addrStr, client]);

  const {
    data: info,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.address(effectiveAddr ?? ''),
    queryFn: () => getAddressInfo(client, effectiveAddr as `0x${string}`),
    enabled: !!effectiveAddr,
  });

  const { data: txHistory, isLoading: txLoading } = useQuery({
    queryKey: queryKeys.addressTxHistory(effectiveAddr ?? '', page),
    queryFn: () => getAddressTxHistory(effectiveAddr!, page),
    enabled: !!effectiveAddr && tab === 'txns',
  });

  const { data: tokenTxs, isLoading: tokenLoading } = useQuery({
    queryKey: queryKeys.tokenTransfers(effectiveAddr ?? ''),
    queryFn: () => getTokenTransfers(effectiveAddr!),
    enabled: !!effectiveAddr && tab === 'tokens',
  });

  const pageTitle = isEns ? addrStr : effectiveAddr ? `${addrStr.slice(0, 10)}...` : 'address';

  return (
    <Layout title={`${pageTitle} · shatter`}>
      {isLoading && <Skeleton />}
      {isError && (
        <ErrorMsg>
          {isEns && !resolvedAddress
            ? `could not resolve ENS name: ${addrStr}`
            : 'failed to load address data'}
        </ErrorMsg>
      )}
      {info && <AddressCard info={info} />}

      <Section>
        <TabBar>
          <Tab
            $active={tab === 'txns'}
            onClick={() => {
              setTab('txns');
              setPage(1);
            }}
          >
            transactions
          </Tab>
          <Tab
            $active={tab === 'tokens'}
            onClick={() => {
              setTab('tokens');
              setPage(1);
            }}
          >
            token transfers
          </Tab>
        </TabBar>

        {tab === 'txns' && (
          <>
            <CardList>
              {txLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} style={{ height: 64 }} />
                  ))
                : txHistory?.map((tx) => <TransactionCard key={tx.hash} tx={tx} />)}
            </CardList>
            {txHistory && txHistory.length > 0 && (
              <PaginationRow>
                <PageBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  ← prev
                </PageBtn>
                <span
                  style={{
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.mono,
                    fontSize: theme.fontSizes.sm,
                    alignSelf: 'center',
                  }}
                >
                  page {page}
                </span>
                <PageBtn disabled={txHistory.length < 25} onClick={() => setPage((p) => p + 1)}>
                  next →
                </PageBtn>
              </PaginationRow>
            )}
          </>
        )}

        {tab === 'tokens' && (
          <div>
            {tokenLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} style={{ height: 48 }} />)
              : tokenTxs?.map((t) => (
                  <TokenTransfer key={`${t.hash}-${t.tokenAddress}`} transfer={t} />
                ))}
          </div>
        )}
      </Section>
    </Layout>
  );
}
