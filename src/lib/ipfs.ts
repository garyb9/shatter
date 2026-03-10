import { IPFS_GATEWAYS } from './consts';
import type { IPFSContent, IPFSContentType } from './types';

function detectContentType(mimeType: string): IPFSContentType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('json')) return 'json';
  if (mimeType.includes('markdown')) return 'markdown';
  if (mimeType.startsWith('text/')) return 'text';
  if (mimeType === 'application/octet-stream') return 'binary';
  return 'unknown';
}

async function parseResponse(cid: string, res: Response, mimeType: string): Promise<IPFSContent> {
  const contentType = detectContentType(mimeType);

  if (contentType === 'image') {
    return {
      cid,
      contentType: 'image',
      mimeType,
      imageUrl: res.url,
    };
  }

  const text = await res.text();

  if (contentType === 'json') {
    try {
      const json = JSON.parse(text);
      // Check if it's NFT metadata with image — treat as rich JSON
      return { cid, contentType: 'json', mimeType, raw: text, json };
    } catch {
      return { cid, contentType: 'text', mimeType, raw: text };
    }
  }

  // For text/plain, check if it looks like markdown
  if (contentType === 'text' || contentType === 'unknown') {
    const looksLikeMarkdown =
      text.startsWith('#') || /\[.+\]\(.+\)/.test(text) || /^\*\*/.test(text);
    return {
      cid,
      contentType: looksLikeMarkdown ? 'markdown' : 'text',
      mimeType,
      raw: text,
    };
  }

  return { cid, contentType, mimeType, raw: text };
}

export async function fetchIPFSContent(cid: string): Promise<IPFSContent> {
  const errors: string[] = [];

  for (const gateway of IPFS_GATEWAYS) {
    try {
      const res = await fetch(`${gateway}${cid}`, {
        signal: AbortSignal.timeout(8000),
      });

      if (!res.ok) {
        errors.push(`${gateway}: HTTP ${res.status}`);
        continue;
      }

      const mimeType =
        res.headers.get('content-type')?.split(';')[0].trim() ?? 'application/octet-stream';

      return await parseResponse(cid, res, mimeType);
    } catch (err) {
      errors.push(`${gateway}: ${err instanceof Error ? err.message : 'unknown error'}`);
      continue;
    }
  }

  throw new Error(`Failed to fetch IPFS content for CID ${cid}. Errors: ${errors.join(', ')}`);
}

export function getIPFSUrl(cid: string, gateway = IPFS_GATEWAYS[0]): string {
  return `${gateway}${cid}`;
}
