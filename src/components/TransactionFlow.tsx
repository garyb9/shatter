import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import type { TransactionDetail } from '@/lib/types';
import { formatAddress, formatEth, formatGwei, formatTimestamp } from '@/lib/format';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const FlowRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AddressBox = styled(Link)`
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.link};
  text-decoration: none;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${theme.colors.link};
  }
`;

const ContractBox = styled.div`
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.txCreate};
  border-radius: 8px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.txCreate};
`;

const ArrowBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  min-width: 80px;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    min-width: unset;
  }
`;

const ArrowLine = styled.div<{ $color: string }>`
  height: 2px;
  width: 100%;
  background: ${(p) => p.$color};
  position: relative;

  &::after {
    content: '▶';
    position: absolute;
    right: -6px;
    top: -9px;
    color: ${(p) => p.$color};
    font-size: 12px;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const ArrowLabel = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
  word-break: break-all;
`;

const StatusBadge = styled.span<{ $ok: boolean }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  background: ${(p) => (p.$ok ? 'rgba(0,224,198,0.1)' : 'rgba(247,106,106,0.1)')};
  color: ${(p) => (p.$ok ? theme.colors.txValue : theme.colors.txReverted)};
  border: 1px solid ${(p) => (p.$ok ? theme.colors.txValue : theme.colors.txReverted)};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 ${theme.spacing.md} 0;
  font-weight: 500;
`;

interface TransactionFlowProps {
  tx: TransactionDetail;
}

const TransactionFlow: React.FC<TransactionFlowProps> = ({ tx }) => {
  const arrowColor =
    tx.status === 'reverted'
      ? theme.colors.txReverted
      : tx.isContractCreation
        ? theme.colors.txCreate
        : tx.input !== '0x'
          ? theme.colors.txContract
          : theme.colors.txValue;

  return (
    <Wrapper>
      {/* Visual flow */}
      <FlowRow>
        <AddressBox href={`/address/${tx.from}`}>{formatAddress(tx.from, 10)}</AddressBox>
        <ArrowBlock>
          <ArrowLine $color={arrowColor} />
          <ArrowLabel>{formatEth(tx.value)}</ArrowLabel>
        </ArrowBlock>
        {tx.to ? (
          <AddressBox href={`/address/${tx.to}`}>{formatAddress(tx.to, 10)}</AddressBox>
        ) : (
          <ContractBox>new contract</ContractBox>
        )}
      </FlowRow>

      {/* Details */}
      <div>
        <SectionTitle>details</SectionTitle>
        <DetailGrid>
          <DetailItem>
            <DetailLabel>status</DetailLabel>
            <DetailValue>
              <StatusBadge $ok={tx.status === 'success'}>{tx.status}</StatusBadge>
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>block</DetailLabel>
            <DetailValue>
              <Link href={`/block/${tx.blockNumber}`} style={{ color: theme.colors.link }}>
                #{Number(tx.blockNumber).toLocaleString()}
              </Link>
            </DetailValue>
          </DetailItem>
          {tx.timestamp && (
            <DetailItem>
              <DetailLabel>timestamp</DetailLabel>
              <DetailValue>{formatTimestamp(tx.timestamp)}</DetailValue>
            </DetailItem>
          )}
          <DetailItem>
            <DetailLabel>value</DetailLabel>
            <DetailValue>{formatEth(tx.value)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>gas used</DetailLabel>
            <DetailValue>{Number(tx.gasUsed).toLocaleString()}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>gas price</DetailLabel>
            <DetailValue>{formatGwei(tx.effectiveGasPrice)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>tx fee</DetailLabel>
            <DetailValue>
              {formatEth((BigInt(tx.gasUsed) * BigInt(tx.effectiveGasPrice)).toString())}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>logs</DetailLabel>
            <DetailValue>{tx.logs.length}</DetailValue>
          </DetailItem>
        </DetailGrid>
      </div>

      {/* Input data */}
      {tx.input && tx.input !== '0x' && (
        <div>
          <SectionTitle>input data</SectionTitle>
          <pre
            style={{
              background: theme.colors.codeBackground,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              padding: theme.spacing.md,
              fontSize: theme.fontSizes.xs,
              fontFamily: theme.fonts.mono,
              color: theme.colors.textSecondary,
              overflowX: 'auto',
              wordBreak: 'break-all',
              whiteSpace: 'pre-wrap',
            }}
          >
            {tx.input}
          </pre>
        </div>
      )}
    </Wrapper>
  );
};

export default TransactionFlow;
