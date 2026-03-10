import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { classifySearchInput } from '@/lib/search';

interface SearchBarProps {
  compact?: boolean;
  placeholder?: string;
}

const Form = styled.form<{ $compact: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: ${(p) => (p.$compact ? '280px' : '100%')};
  max-width: ${(p) => (p.$compact ? '280px' : '600px')};

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    max-width: 100%;
  }
`;

const Input = styled.input<{ $compact: boolean }>`
  flex: 1;
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.mono};
  font-size: ${(p) => (p.$compact ? theme.fontSizes.sm : theme.fontSizes.base)};
  padding: ${(p) =>
    p.$compact
      ? `${theme.spacing.sm} ${theme.spacing.base}`
      : `${theme.spacing.base} ${theme.spacing.md}`};
  outline: none;
  transition: border-color 0.2s ease;
  min-width: 0;

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }

  &:focus {
    border-color: ${theme.colors.link};
  }
`;

const Button = styled.button<{ $compact: boolean }>`
  background: ${theme.colors.link};
  border: none;
  border-radius: 6px;
  color: ${theme.colors.background};
  cursor: pointer;
  font-size: ${(p) => (p.$compact ? theme.fontSizes.sm : theme.fontSizes.base)};
  font-weight: 600;
  padding: ${(p) =>
    p.$compact
      ? `${theme.spacing.sm} ${theme.spacing.base}`
      : `${theme.spacing.base} ${theme.spacing.md}`};
  white-space: nowrap;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const SearchBar: React.FC<SearchBarProps> = ({
  compact = false,
  placeholder = 'address / tx hash / block / ENS / IPFS CID',
}) => {
  const [value, setValue] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const result = classifySearchInput(trimmed);
    router.push(result.route);
    setValue('');
  };

  return (
    <Form onSubmit={handleSubmit} $compact={compact}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={compact ? 'search...' : placeholder}
        $compact={compact}
        spellCheck={false}
        autoComplete="off"
      />
      <Button type="submit" $compact={compact}>
        →
      </Button>
    </Form>
  );
};

export default SearchBar;
