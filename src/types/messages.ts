import type { ContextItem, PageContextPayload } from './context';

export const MESSAGE_TYPES = {
  COLLECT_PAGE_CONTEXT: 'COLLECT_PAGE_CONTEXT',
  STORE_CONTEXT_ITEM: 'STORE_CONTEXT_ITEM',
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export interface CollectPageContextMessage {
  type: typeof MESSAGE_TYPES.COLLECT_PAGE_CONTEXT;
}

export interface StoreContextItemMessage {
  type: typeof MESSAGE_TYPES.STORE_CONTEXT_ITEM;
  payload: PageContextPayload;
}

export type ExtensionMessage = CollectPageContextMessage | StoreContextItemMessage;

export interface MessageResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export type CollectPageContextResponse = MessageResponse<PageContextPayload>;

export type StoreContextItemResponse = MessageResponse<ContextItem>;
