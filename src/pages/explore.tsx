import React from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import BlockCard from '@/components/BlockCard';
import GasChart from '@/components/GasChart';
import { theme } from '@/styles/theme';
import { useEthereum } from '@/contexts/EthereumContext';
import { getLatestBlocks, getGasHistory } from '@/lib/ethereum';
import { queryKeys } from '@/lib/queryKeys';
import { LIVE_FEED_POLL_INTERVAL_MS } from '@/lib/consts';

const PageTitle = styled.h1`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes['2xl']};
  font-weight: 400;
  color: ${theme.colors.text};
  margin: 0 0 ${theme.spacing.xl};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
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

const SearchSection = styled.div`
  margin-bottom: ${theme.spacing['2xl']};
  padding-bottom: ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.border};
`;

const SearchHints = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  margin-top: ${theme.spacing.md};
`;

const Hint = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  padding: 2px 8px;
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

export default function ExplorePage() {
  const { client } = useEthereum();

  const { data: blocks, isLoading: blocksLoading } = useQuery({
    queryKey: queryKeys.latestBlocks(12),
    queryFn: () => getLatestBlocks(client, 12),
    refetchInterval: LIVE_FEED_POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  });

  const { data: gasData } = useQuery({
    queryKey: queryKeys.gasHistory(30),
    queryFn: () => getGasHistory(client, 30),
    refetchInterval: LIVE_FEED_POLL_INTERVAL_MS * 2,
    refetchIntervalInBackground: true,
  });

  return (
    <Layout title="explore · shatter">
      <PageTitle>explore</PageTitle>

      <SearchSection>
        <SearchBar placeholder="address / tx hash / block number / ENS / IPFS CID" />
        <SearchHints>
          <Hint>0x... address</Hint>
          <Hint>0x...64chars tx</Hint>
          <Hint>21000000 block</Hint>
          <Hint>vitalik.eth ENS</Hint>
          <Hint>Qm... IPFS</Hint>
        </SearchHints>
      </SearchSection>

      <Section style={{ marginBottom: theme.spacing.xl }}>
        <SectionTitle>gas · base fee trend</SectionTitle>
        <GasChart data={gasData ?? []} />
      </Section>

      <Grid>
        <Section>
          <SectionTitle>latest blocks</SectionTitle>
          {blocksLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : blocks?.map((block) => <BlockCard key={block.hash} block={block} />)}
        </Section>

        <Section>
          <SectionTitle>quick nav</SectionTitle>
          <div
            style={{
              background: theme.colors.codeBackground,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px',
              padding: theme.spacing.lg,
              fontFamily: theme.fonts.mono,
              fontSize: theme.fontSizes.sm,
              color: theme.colors.textSecondary,
              lineHeight: 2,
            }}
          >
            <div>
              <span style={{ color: theme.colors.link }}>/address/</span>
              {'<address or ENS>'}
            </div>
            <div>
              <span style={{ color: theme.colors.link }}>/tx/</span>
              {'<tx hash>'}
            </div>
            <div>
              <span style={{ color: theme.colors.link }}>/block/</span>
              {'<block number>'}
            </div>
            <div>
              <span style={{ color: theme.colors.link }}>/ipfs/</span>
              {'<CID>'}
            </div>
          </div>

          <div
            style={{
              background: theme.colors.codeBackground,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px',
              padding: theme.spacing.lg,
              marginTop: theme.spacing.md,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: theme.fontSizes.xs,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.md,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              notable addresses
            </div>
            {[
              { label: 'vitalik.eth', href: '/address/vitalik.eth' },
              {
                label: 'uniswap v3 factory',
                href: '/address/0x1F98431c8aD98523631AE4a59f267346ea31F984',
              },
              {
                label: 'eth 2 deposit',
                href: '/address/0x00000000219ab540356cBB839Cbe05303d7705Fa',
              },
              {
                label: 'burn address',
                href: '/address/0x0000000000000000000000000000000000000000',
              },
            ].map((item) => (
              <div key={item.href} style={{ marginBottom: theme.spacing.sm }}>
                <a
                  href={item.href}
                  style={{
                    color: theme.colors.link,
                    fontFamily: theme.fonts.mono,
                    fontSize: theme.fontSizes.xs,
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </a>
              </div>
            ))}
          </div>
        </Section>
      </Grid>
    </Layout>
  );
}
