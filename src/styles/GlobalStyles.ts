import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
    font-size: ${theme.fontSizes.base};
  }

  a {
    color: ${theme.colors.link};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${theme.colors.linkHover};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 600;
    line-height: 1.3;
    margin: 0 0 ${theme.spacing.md} 0;
  }

  h1 { font-size: ${theme.fontSizes['4xl']}; }
  h2 { font-size: ${theme.fontSizes['3xl']}; }
  h3 { font-size: ${theme.fontSizes['2xl']}; }
  h4 { font-size: ${theme.fontSizes.xl}; }

  p {
    margin: 0 0 ${theme.spacing.md} 0;
  }

  ul, ol {
    margin: 0 0 ${theme.spacing.md} 0;
    padding-left: ${theme.spacing.xl};
  }

  li {
    margin-bottom: ${theme.spacing.xs};
  }

  code {
    background-color: ${theme.colors.codeBackground};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: 4px;
    font-family: ${theme.fonts.mono};
    font-size: 0.9em;
  }

  pre {
    background-color: ${theme.colors.codeBackground};
    padding: ${theme.spacing.lg};
    border-radius: 8px;
    overflow-x: auto;
    margin: ${theme.spacing.lg} 0;
  }

  pre code {
    background: none;
    padding: 0;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  hr {
    border: none;
    border-top: 1px solid ${theme.colors.border};
    margin: ${theme.spacing.xl} 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${theme.spacing.lg} 0;
  }

  th, td {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${theme.colors.border};
  }

  th {
    font-weight: 600;
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSizes.sm};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;
