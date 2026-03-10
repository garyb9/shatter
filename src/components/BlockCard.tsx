import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import type { BlockSummary } from '@/lib/types';
import { formatRelativeTime, formatBlockNumber } from '@/lib/format';

const Card = styled.div`
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
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
    gap: ${theme.spacing.sm};
  }
`;

const BlockNum = styled(Link)`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: ${theme.colors.link};
  white-space: nowrap;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Miner = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    align-items: flex-start;
    flex-direction: row;
    gap: ${theme.spacing.md};
  }
`;

const StatLine = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
`;

const TxCount = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
  font-weight: 500;
`;

const Age = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
`;

interface BlockCardProps {
  block: BlockSummary;
}

const BlockCard: React.FC<BlockCardProps> = ({ block }) => {
  const minerShort = `${block.miner.slice(0, 10)}...${block.miner.slice(-4)}`;
  const gasUsedPct =
    block.gasLimit !== '0' ? Math.round((Number(block.gasUsed) / Number(block.gasLimit)) * 100) : 0;

  return (
    <Card>
      <BlockNum href={`/block/${block.number}`}>{formatBlockNumber(block.number)}</BlockNum>
      <Meta>
        <Age>{block.timestamp ? formatRelativeTime(block.timestamp) : '—'}</Age>
        <Miner>miner {minerShort}</Miner>
      </Meta>
      <Stats>
        <TxCount>{block.transactionCount} txns</TxCount>
        <StatLine>gas {gasUsedPct}%</StatLine>
        {block.baseFeePerGas && (
          <StatLine>{(Number(BigInt(block.baseFeePerGas)) / 1e9).toFixed(2)} Gwei</StatLine>
        )}
      </Stats>
    </Card>
  );
};

export default BlockCard;
