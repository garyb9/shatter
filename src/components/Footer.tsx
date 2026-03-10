import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { SITE_CONFIG } from '@/lib/consts';

const FooterWrapper = styled.footer`
  text-align: center;
  padding: ${theme.spacing.xl} ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  border-top: 1px solid ${theme.colors.border};
  margin-top: auto;
  font-family: ${theme.fonts.mono};
`;

const Footer: React.FC = () => (
  <FooterWrapper>
    {SITE_CONFIG.name} · open data · {new Date().getFullYear()}
  </FooterWrapper>
);

export default Footer;
