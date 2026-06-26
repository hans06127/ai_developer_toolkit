import type { PageContextPayload, SourceMetadata, SourceType } from '../types/context';

export interface SourceAdapterMatch {
  sourceType: SourceType;
  adapterId: string;
  metadata: SourceMetadata;
  tags?: string[];
}

export interface SourceAdapter {
  id: string;
  label: string;
  match: (payload: PageContextPayload) => SourceAdapterMatch | null;
}
