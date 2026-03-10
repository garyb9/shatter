import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import type { TransactionSummary } from '@/lib/types';
import {
  formatAddress,
  formatEth,
  formatRelativeTime,
  formatTxType,
  shortenHash,
} from '@/lib/format';

const txTypeColor = (type: ReturnType<typeof formatTxType>, status: string) => {
  if (status === 'reverted') return theme.colors.txReverted;
  if (status === 'pending') return theme.colors.txPending;
  if (type === 'contract-create') return theme.colors.txCreate;
  if (type === 'contract-call') return theme.colors.txContract;
  return theme.colors.txValue;
};

const Card = styled.div`
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${theme.spacing.md};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${theme.colors.borderLight};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xs};
  }
`;

const HashLink = styled(Link)`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.link};
  white-space: nowrap;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: ${theme.colors.link};
  }
`;

const Arrow = styled.span<{ $type: string; $status: string }>`
  color: ${(p) => txTypeColor(p.$type as ReturnType<typeof formatTxType>, p.$status)};
  font-size: ${theme.fontSizes.sm};
  flex-shrink: 0;
`;

const TypeBadge = styled.span<{ $type: string; $status: string }>`
  font-size: ${theme.fontSizes.xs};
  color: ${(p) => txTypeColor(p.$type as ReturnType<typeof formatTxType>, p.$status)};
  border: 1px solid currentColor;
  border-radius: 4px;
  padding: 1px 6px;
  white-space: nowrap;
  flex-shrink: 0;
  opacity: 0.8;
`;

const Value = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
`;

const EthValue = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
  white-space: nowrap;
`;

const Age = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
`;

interface TransactionCardProps {
  tx: TransactionSummary;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ tx }) => {
  const txType = formatTxType(tx.to, tx.input);
  const typeLabel =
    tx.status === 'reverted'
      ? 'reverted'
      : txType === 'contract-create'
        ? 'deploy'
        : txType === 'contract-call'
          ? 'call'
          : 'transfer';

  return (
    <Card>
      <div>
        <HashLink href={`/tx/${tx.hash}`}>{shortenHash(tx.hash)}</HashLink>
        {tx.timestamp && <Age style={{ display: 'block' }}>{formatRelativeTime(tx.timestamp)}</Age>}
      </div>
      <Flow>
        <AddressLink href={`/address/${tx.from}`}>{formatAddress(tx.from)}</AddressLink>
        <Arrow $type={txType} $status={tx.status}>
          →
        </Arrow>
        {tx.to ? (
          <AddressLink href={`/address/${tx.to}`}>{formatAddress(tx.to)}</AddressLink>
        ) : (
          <span style={{ fontSize: theme.fontSizes.xs, color: theme.colors.txCreate }}>
            contract
          </span>
        )}
        <TypeBadge $type={txType} $status={tx.status}>
          {typeLabel}
        </TypeBadge>
      </Flow>
      <Value>
        <EthValue>{formatEth(tx.value)}</EthValue>
      </Value>
    </Card>
  );
};

export default TransactionCard;
