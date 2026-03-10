import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import type { TokenTransfer as TokenTransferType } from '@/lib/types';
import { formatAddress, formatTokenValue, shortenHash } from '@/lib/format';

const Row = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xs};
  }
`;

const HashLink = styled(Link)`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.link};
`;

const Flow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  min-width: 0;
  overflow: hidden;
`;

const AddressLink = styled(Link)`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: ${theme.colors.link};
  }
`;

const TokenBadge = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.txContract};
  border: 1px solid ${theme.colors.txContract};
  border-radius: 4px;
  padding: 1px 6px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const Amount = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
  white-space: nowrap;
`;

interface TokenTransferProps {
  transfer: TokenTransferType;
}

const TokenTransfer: React.FC<TokenTransferProps> = ({ transfer }) => (
  <Row>
    <HashLink href={`/tx/${transfer.hash}`}>{shortenHash(transfer.hash)}</HashLink>
    <Flow>
      <AddressLink href={`/address/${transfer.from}`}>{formatAddress(transfer.from)}</AddressLink>
      <span style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.xs }}>→</span>
      <AddressLink href={`/address/${transfer.to}`}>{formatAddress(transfer.to)}</AddressLink>
      <TokenBadge>{transfer.tokenSymbol || transfer.tokenType}</TokenBadge>
    </Flow>
    <Amount>
      {transfer.tokenType === 'ERC721' || transfer.tokenType === 'ERC1155'
        ? `#${transfer.tokenId ?? '?'}`
        : formatTokenValue(transfer.value, transfer.tokenDecimals)}{' '}
      {transfer.tokenSymbol}
    </Amount>
  </Row>
);

export default TokenTransfer;
