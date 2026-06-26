import type { SourceAdapter } from './types';
import { getLastPathSegment, parseUrl } from './url';

const normalizeNodeId = (nodeId: string | null): string | undefined => nodeId?.replace('-', ':') || undefined;

export const figmaAdapter: SourceAdapter = {
  id: 'figma-url',
  label: 'Figma',
  match: (payload) => {
    const url = parseUrl(payload.url);

    if (!url || !url.hostname.endsWith('figma.com')) {
      return null;
    }

    const pathParts = url.pathname.split('/').filter(Boolean);
    const fileKind = pathParts[0];
    const fileKey = pathParts[1];
    const fileName = pathParts[2] ? decodeURIComponent(pathParts[2]) : undefined;
    const metadata = {
      platform: 'Figma',
      fileKind: fileKind ?? 'unknown',
      fileKey: fileKey ?? '',
      fileName: fileName ?? payload.title,
      nodeId: normalizeNodeId(url.searchParams.get('node-id')) ?? '',
      pageId: url.searchParams.get('page-id') ?? '',
      mode: url.searchParams.get('mode') ?? '',
      lastPathSegment: getLastPathSegment(url) ?? '',
    };

    return {
      sourceType: 'figma',
      adapterId: 'figma-url',
      metadata,
      tags: ['figma', fileKind].filter((tag): tag is string => Boolean(tag)),
    };
  },
};
