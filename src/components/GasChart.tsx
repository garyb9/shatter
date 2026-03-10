import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import type { GasDataPoint } from '@/lib/types';

const Wrapper = styled.div`
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: ${theme.spacing.md};
`;

const Title = styled.div`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${theme.spacing.md};
`;

const ChartArea = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 80px;
`;

const Bar = styled.div<{ $height: number; $ratio: number }>`
  flex: 1;
  height: ${(p) => Math.max(4, p.$height)}px;
  background: ${(p) =>
    p.$ratio > 0.9
      ? theme.colors.txReverted
      : p.$ratio > 0.7
        ? theme.colors.txCreate
        : theme.colors.link};
  border-radius: 2px 2px 0 0;
  opacity: 0.7;
  transition: opacity 0.15s ease;
  cursor: default;
  position: relative;

  &:hover {
    opacity: 1;
  }

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.colors.background};
    border: 1px solid ${theme.colors.border};
    border-radius: 4px;
    padding: 4px 8px;
    font-size: ${theme.fontSizes.xs};
    font-family: ${theme.fonts.mono};
    color: ${theme.colors.text};
    white-space: nowrap;
    z-index: 10;
    pointer-events: none;
  }
`;

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${theme.spacing.xs};
`;

const Label = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: 10px;
  color: ${theme.colors.textSecondary};
`;

interface GasChartProps {
  data: GasDataPoint[];
}

const GasChart: React.FC<GasChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Wrapper>
        <Title>base fee (Gwei)</Title>
        <div
          style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes.xs }}>
            loading...
          </span>
        </div>
      </Wrapper>
    );
  }

  const fees = data.map((d) => (d.baseFeePerGas ? Number(BigInt(d.baseFeePerGas)) / 1e9 : 0));
  const maxFee = Math.max(...fees, 1);

  return (
    <Wrapper>
      <Title>base fee (Gwei) — last {data.length} blocks</Title>
      <ChartArea>
        {data.map((point, i) => {
          const fee = fees[i];
          const heightPx = (fee / maxFee) * 76;
          const tooltip = `#${point.blockNumber} · ${fee.toFixed(2)} Gwei · ${Math.round(point.gasUsedRatio * 100)}% full`;
          return (
            <Bar
              key={point.blockNumber}
              $height={heightPx}
              $ratio={point.gasUsedRatio}
              data-tooltip={tooltip}
            />
          );
        })}
      </ChartArea>
      <Labels>
        <Label>#{data[0]?.blockNumber}</Label>
        <Label>{maxFee.toFixed(1)} max</Label>
        <Label>#{data[data.length - 1]?.blockNumber}</Label>
      </Labels>
    </Wrapper>
  );
};

export default GasChart;
