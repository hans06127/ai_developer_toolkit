import type { PageContextPayload, SourceMetadata, SourceType } from '../types/context';
import { normalizeTags } from '../utils/tags';
import { figmaAdapter } from './figmaAdapter';
import { githubAdapter } from './githubAdapter';
import { openApiAdapter } from './openApiAdapter';
import type { SourceAdapterMatch } from './types';

const adapters = [figmaAdapter, githubAdapter, openApiAdapter];

const fallbackMatch = (payload: PageContextPayload): SourceAdapterMatch => {
  if (payload.sourceType) {
    return {
      sourceType: payload.sourceType,
      adapterId: payload.sourceAdapterId ?? 'manual',
      metadata: payload.sourceMetadata ?? {},
    };
  }

  if (!payload.url) {
    return { sourceType: 'note', adapterId: 'local-note', metadata: {} };
  }

  const url = payload.url.toLowerCase();

  if (url.includes('docs.') || url.includes('/docs') || url.includes('documentation')) {
    return { sourceType: 'documentation', adapterId: 'generic-url', metadata: {} };
  }

  return { sourceType: 'webpage', adapterId: 'generic-url', metadata: {} };
};

export const detectSource = (payload: PageContextPayload): SourceAdapterMatch => {
  for (const adapter of adapters) {
    const match = adapter.match(payload);

    if (match) {
      return match;
    }
  }

  return fallbackMatch(payload);
};

export const mergeSourceMetadata = (
  detectedMetadata: SourceMetadata,
  payloadMetadata: SourceMetadata | undefined,
): SourceMetadata => ({
  ...detectedMetadata,
  ...(payloadMetadata ?? {}),
});

export const mergeSourceTags = (payloadTags: string[] | undefined, detectedTags: string[] | undefined): string[] =>
  normalizeTags([...(detectedTags ?? []), ...(payloadTags ?? [])]);

export const sourceTypeLabels: Record<SourceType, string> = {
  webpage: '網頁',
  article: '文章',
  documentation: '文件',
  figma: 'Figma',
  github: 'GitHub',
  openapi: 'Swagger / OpenAPI',
  issue: 'Issue / PR',
  code: '程式碼',
  note: '筆記',
  other: '其他',
};
