import React from 'react';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MobileProvider } from '@/contexts/MobileContext';
import { EthereumProvider } from '@/contexts/EthereumContext';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <EthereumProvider>
        <MobileProvider>
          <Component {...pageProps} />
        </MobileProvider>
      </EthereumProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
