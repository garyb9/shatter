import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import Layout from '@/components/Layout';
import IPFSViewer from '@/components/IPFSViewer';
import { theme } from '@/styles/theme';
import { fetchIPFSContent } from '@/lib/ipfs';
import { queryKeys } from '@/lib/queryKeys';

const PageTitle = styled.h1`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  font-weight: 400;
  color: ${theme.colors.textSecondary};
  margin: 0 0 ${theme.spacing.xl};
  word-break: break-all;

  span {
    color: ${theme.colors.link};
  }
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
  height: 300px;
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

export default function IPFSPage() {
  const router = useRouter();
  const { cid } = router.query;
  const cidStr = typeof cid === 'string' ? cid : '';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.ipfs(cidStr),
    queryFn: () => fetchIPFSContent(cidStr),
    enabled: !!cidStr,
    staleTime: Infinity, // IPFS content is immutable
    retry: 3,
  });

  return (
    <Layout title={`ipfs ${cidStr.slice(0, 16)}... · shatter`}>
      <PageTitle>
        ipfs / <span>{cidStr}</span>
      </PageTitle>

      {isLoading && <Skeleton />}
      {isError && (
        <ErrorMsg>
          failed to fetch IPFS content: {error instanceof Error ? error.message : 'unknown error'}
        </ErrorMsg>
      )}
      {data && <IPFSViewer content={data} />}
    </Layout>
  );
}
