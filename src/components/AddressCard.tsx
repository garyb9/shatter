import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import type { AddressInfo } from '@/lib/types';
import { formatEth } from '@/lib/format';

const Card = styled.div`
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: ${theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
`;

const Address = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  word-break: break-all;
`;

const EnsName = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes['2xl']};
  color: ${theme.colors.text};
  margin: 0;
`;

const TypeBadge = styled.span<{ $isContract: boolean }>`
  font-size: ${theme.fontSizes.xs};
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid ${(p) => (p.$isContract ? theme.colors.txContract : theme.colors.border)};
  color: ${(p) => (p.$isContract ? theme.colors.txContract : theme.colors.textSecondary)};
  flex-shrink: 0;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: ${theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.span`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: ${theme.colors.text};
`;

interface AddressCardProps {
  info: AddressInfo;
}

const AddressCard: React.FC<AddressCardProps> = ({ info }) => (
  <Card>
    <Header>
      {info.ensName && <EnsName>{info.ensName}</EnsName>}
      <TypeBadge $isContract={info.isContract}>{info.isContract ? 'contract' : 'EOA'}</TypeBadge>
    </Header>
    <Address>{info.address}</Address>
    <Stats style={{ marginTop: theme.spacing.lg }}>
      <StatItem>
        <StatLabel>balance</StatLabel>
        <StatValue>{formatEth(info.balance, 4)}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>transactions</StatLabel>
        <StatValue>{info.txCount.toLocaleString()}</StatValue>
      </StatItem>
    </Stats>
  </Card>
);

export default AddressCard;
