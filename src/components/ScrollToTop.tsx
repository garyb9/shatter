import React, { useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { useScrollContext } from '@/contexts/ScrollContext';

const ScrollButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  opacity: 0;
  visibility: hidden;
  z-index: 1000;

  &:hover {
    background: ${theme.colors.link};
    color: ${theme.colors.white};
    border-color: ${theme.colors.link};
    transform: translateY(-2px);
  }

  &.visible {
    opacity: 1;
    visibility: visible;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const ScrollToTop: React.FC = () => {
  const { isScrollButtonVisible, setIsScrollButtonVisible } = useScrollContext();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsScrollButtonVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [setIsScrollButtonVisible]);

  return (
    <ScrollButton
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={isScrollButtonVisible ? 'visible' : ''}
      aria-label="Scroll to top"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
      </svg>
    </ScrollButton>
  );
};

export default ScrollToTop;
