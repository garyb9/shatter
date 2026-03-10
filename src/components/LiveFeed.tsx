import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { theme } from '@/styles/theme';
import { useEthereum } from '@/contexts/EthereumContext';
import { getLatestBlocks } from '@/lib/ethereum';
import { queryKeys } from '@/lib/queryKeys';
import { LIVE_FEED_POLL_INTERVAL_MS, LIVE_FEED_BLOCK_COUNT } from '@/lib/consts';
import BlockCard from './BlockCard';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0;
  font-weight: 500;
`;

const LiveDot = styled.span<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? theme.colors.link : theme.colors.textSecondary)};
  display: inline-block;
  margin-right: ${theme.spacing.sm};
  box-shadow: ${(p) => (p.$active ? `0 0 8px ${theme.colors.link}` : 'none')};
`;

const ErrorMsg = styled.div`
  color: ${theme.colors.txReverted};
  font-size: ${theme.fontSizes.sm};
  font-family: ${theme.fonts.mono};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.txReverted};
  border-radius: 6px;
  opacity: 0.7;
`;

const SkeletonCard = styled.div`
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  height: 64px;
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

const TabBar = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: 1px solid ${(p) => (p.$active ? theme.colors.link : theme.colors.border)};
  border-radius: 4px;
  color: ${(p) => (p.$active ? theme.colors.link : theme.colors.textSecondary)};
  cursor: pointer;
  font-size: ${theme.fontSizes.xs};
  padding: 4px 10px;
  transition: all 0.15s ease;
  font-family: ${theme.fonts.mono};

  &:hover {
    border-color: ${theme.colors.link};
    color: ${theme.colors.link};
  }
`;

const LiveFeed: React.FC = () => {
  const { client } = useEthereum();
  const [tab, setTab] = useState<'blocks' | 'txns'>('blocks');

  const {
    data: blocks,
    isLoading,
    isError,
    dataUpdatedAt,
  } = useQuery({
    queryKey: queryKeys.latestBlocks(LIVE_FEED_BLOCK_COUNT),
    queryFn: () => getLatestBlocks(client, LIVE_FEED_BLOCK_COUNT),
    refetchInterval: LIVE_FEED_POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  });

  const recentHashes =
    blocks
      ?.flatMap((b) =>
        Array.from({ length: Math.min(b.transactionCount, 3) }, (_, i) => ({
          blockNumber: b.number,
          index: i,
          timestamp: b.timestamp,
        }))
      )
      .slice(0, 15) ?? [];

  const isLive = !!dataUpdatedAt && Date.now() - dataUpdatedAt < LIVE_FEED_POLL_INTERVAL_MS * 2;

  return (
    <Wrapper>
      <SectionHeader>
        <SectionTitle>
          <LiveDot $active={isLive} />
          live chain data
        </SectionTitle>
        <TabBar>
          <Tab $active={tab === 'blocks'} onClick={() => setTab('blocks')}>
            blocks
          </Tab>
          <Tab $active={tab === 'txns'} onClick={() => setTab('txns')}>
            transactions
          </Tab>
        </TabBar>
      </SectionHeader>

      {isError && <ErrorMsg>failed to fetch chain data — check your RPC endpoint</ErrorMsg>}

      {tab === 'blocks' && (
        <Section>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : blocks?.map((block) => <BlockCard key={block.hash} block={block} />)}
        </Section>
      )}

      {tab === 'txns' && (
        <Section>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : recentHashes.length === 0 ? (
            <div style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.sm }}>
              no recent transactions
            </div>
          ) : (
            recentHashes.map((item, i) => (
              <div
                key={`${item.blockNumber}-${item.index}`}
                style={{
                  background: theme.colors.codeBackground,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                  fontFamily: theme.fonts.mono,
                  fontSize: theme.fontSizes.xs,
                  color: theme.colors.textSecondary,
                }}
              >
                block #{Number(item.blockNumber).toLocaleString()} · tx {item.index + 1}
                {i === 0 && (
                  <span style={{ marginLeft: theme.spacing.sm, color: theme.colors.link }}>
                    latest
                  </span>
                )}
              </div>
            ))
          )}
          <div
            style={{
              fontSize: theme.fontSizes.xs,
              color: theme.colors.textSecondary,
              textAlign: 'center',
              paddingTop: theme.spacing.sm,
            }}
          >
            full tx details available on the block or tx pages
          </div>
        </Section>
      )}
    </Wrapper>
  );
};

export default LiveFeed;
