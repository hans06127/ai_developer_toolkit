export const SOURCE_TYPES = [
  'webpage',
  'article',
  'documentation',
  'figma',
  'github',
  'openapi',
  'issue',
  'code',
  'note',
  'other',
] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

export type SourceMetadata = Record<string, string>;

export interface ContextItem {
  id: string;
  title: string;
  url: string;
  selectedText?: string;
  note?: string;
  sourceType: SourceType;
  sourceAdapterId: string;
  sourceMetadata: SourceMetadata;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface PageContextPayload {
  title: string;
  url: string;
  selectedText?: string;
  note?: string;
  sourceType?: SourceType;
  sourceAdapterId?: string;
  sourceMetadata?: SourceMetadata;
  tags?: string[];
}
