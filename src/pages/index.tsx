import React from 'react';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import LiveFeed from '@/components/LiveFeed';
import { theme } from '@/styles/theme';
import { SITE_CONFIG } from '@/lib/consts';

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing['2xl']} 0 ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.xl};
`;

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes['5xl']};
  font-weight: 400;
  color: ${theme.colors.link};
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes['4xl']};
  }
`;

const HeroSub = styled.p`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
`;

export default function HomePage() {
  return (
    <Layout title={SITE_CONFIG.name} description={SITE_CONFIG.description}>
      <Hero>
        <HeroTitle>{SITE_CONFIG.name}</HeroTitle>
        <HeroSub>visual blockchain explorer · eth mainnet · ipfs</HeroSub>
        <SearchRow>
          <SearchBar />
        </SearchRow>
      </Hero>
      <LiveFeed />
    </Layout>
  );
}
