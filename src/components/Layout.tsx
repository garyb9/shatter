import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import { SITE_CONFIG } from '@/lib/consts';
import Navigation from './Navigation';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { ScrollProvider } from '@/contexts/ScrollContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  max-width: ${theme.maxWidth.content};
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  width: 100%;
`;

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = SITE_CONFIG.name,
  description = SITE_CONFIG.description,
}) => {
  return (
    <ScrollProvider>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GlobalStyles />
      <Container>
        <Navigation />
        <Main>{children}</Main>
        <Footer />
        <ScrollToTop />
      </Container>
    </ScrollProvider>
  );
};

export default Layout;
