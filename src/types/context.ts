export const SOURCE_TYPES = ['webpage', 'article', 'documentation', 'issue', 'code', 'note', 'other'] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

export interface ContextItem {
  id: string;
  title: string;
  url: string;
  selectedText?: string;
  note?: string;
  sourceType: SourceType;
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
  tags?: string[];
}
