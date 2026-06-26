export interface ContextItem {
  id: string;
  title: string;
  url: string;
  selectedText?: string;
  createdAt: string;
}

export interface PageContextPayload {
  title: string;
  url: string;
  selectedText?: string;
}
