import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import type { IPFSContent } from '@/lib/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const MetaBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
`;

const ContentTypeBadge = styled.span`
  color: ${theme.colors.link};
  font-weight: 600;
`;

const MarkdownBody = styled.div`
  line-height: 1.7;

  h1,
  h2,
  h3,
  h4 {
    color: ${theme.colors.text};
    margin-top: ${theme.spacing.xl};
  }

  p {
    color: ${theme.colors.text};
  }

  a {
    color: ${theme.colors.link};
  }

  code {
    font-family: ${theme.fonts.mono};
    font-size: 0.9em;
    background: ${theme.colors.codeBackground};
    padding: 2px 6px;
    border-radius: 4px;
  }

  pre {
    background: ${theme.colors.codeBackground};
    border: 1px solid ${theme.colors.border};
    border-radius: 8px;
    padding: ${theme.spacing.md};
    overflow-x: auto;
  }

  pre code {
    background: none;
    padding: 0;
  }

  blockquote {
    border-left: 3px solid ${theme.colors.link};
    margin: ${theme.spacing.lg} 0;
    padding-left: ${theme.spacing.lg};
    color: ${theme.colors.textSecondary};
    font-style: italic;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
  }

  th {
    background: ${theme.colors.codeBackground};
  }

  img {
    max-width: 100%;
    border-radius: 6px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const IPFSImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  border: 1px solid ${theme.colors.border};
`;

const JsonBlock = styled.pre`
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: ${theme.spacing.lg};
  overflow-x: auto;
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

const TextBlock = styled.pre`
  background: ${theme.colors.codeBackground};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: ${theme.spacing.lg};
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
`;

const BinaryMessage = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes.sm};
`;

interface IPFSViewerProps {
  content: IPFSContent;
}

const IPFSViewer: React.FC<IPFSViewerProps> = ({ content }) => {
  const renderContent = () => {
    switch (content.contentType) {
      case 'markdown':
        return (
          <MarkdownBody>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.raw ?? ''}</ReactMarkdown>
          </MarkdownBody>
        );
      case 'image':
        return (
          <ImageWrapper>
            <IPFSImage src={content.imageUrl} alt={`IPFS content ${content.cid}`} />
          </ImageWrapper>
        );
      case 'json':
        return <JsonBlock>{JSON.stringify(content.json, null, 2)}</JsonBlock>;
      case 'text':
        return <TextBlock>{content.raw}</TextBlock>;
      case 'binary':
        return (
          <BinaryMessage>
            binary content ({content.mimeType}) — cannot display in browser
          </BinaryMessage>
        );
      default:
        return <TextBlock>{content.raw ?? 'no content'}</TextBlock>;
    }
  };

  return (
    <Wrapper>
      <MetaBar>
        <ContentTypeBadge>{content.contentType}</ContentTypeBadge>
        <span>{content.mimeType}</span>
        <span style={{ marginLeft: 'auto', fontFamily: theme.fonts.mono }}>{content.cid}</span>
      </MetaBar>
      {renderContent()}
    </Wrapper>
  );
};

export default IPFSViewer;
