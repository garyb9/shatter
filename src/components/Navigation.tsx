import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { SITE_CONFIG, NAV_LINKS } from '@/lib/consts';
import SearchBar from './SearchBar';

const Nav = styled.nav`
  border-bottom: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.background};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: ${theme.maxWidth.content};
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  height: 60px;
`;

const Logo = styled(Link)`
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: ${theme.colors.link};
  text-decoration: none;
  flex-shrink: 0;
  letter-spacing: -0.02em;

  &:hover {
    color: ${theme.colors.text};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  flex-shrink: 0;
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: ${(props) => (props.$isActive ? theme.colors.link : theme.colors.textSecondary)};
  text-decoration: none;
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.link};
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const Navigation: React.FC = () => {
  const router = useRouter();

  return (
    <Nav>
      <NavContainer>
        <Logo href="/">{SITE_CONFIG.name}</Logo>
        <NavLinks>
          {NAV_LINKS.map((item) => (
            <NavLink key={item.href} href={item.href} $isActive={router.pathname === item.href}>
              {item.label}
            </NavLink>
          ))}
        </NavLinks>
        <SearchWrapper>
          <SearchBar compact />
        </SearchWrapper>
      </NavContainer>
    </Nav>
  );
};

export default Navigation;
