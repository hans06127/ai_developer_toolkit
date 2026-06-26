import { addContextItem } from '../storage/contextStorage';
import {
  MESSAGE_TYPES,
  type CollectPageContextMessage,
  type CollectPageContextResponse,
} from '../types/messages';
import type { ContextItem, PageContextPayload } from '../types/context';
import { cleanOptionalText } from '../utils/text';
import { detectSource, mergeSourceMetadata, mergeSourceTags } from '../sourceAdapters';
import { createId } from '../utils/id';

const createContextItem = (payload: PageContextPayload): ContextItem => {
  const detectedSource = detectSource(payload);

  return {
    id: createId(),
    title: payload.title.trim() || '未命名頁面',
    url: payload.url,
    selectedText: cleanOptionalText(payload.selectedText),
    note: cleanOptionalText(payload.note),
    sourceType: detectedSource.sourceType,
    sourceAdapterId: payload.sourceAdapterId ?? detectedSource.adapterId,
    sourceMetadata: mergeSourceMetadata(detectedSource.metadata, payload.sourceMetadata),
    tags: mergeSourceTags(payload.tags, detectedSource.tags),
    createdAt: new Date().toISOString(),
  };
};

const getActiveTabId = async (): Promise<number> => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    throw new Error('找不到目前分頁。');
  }

  return tab.id;
};

const collectFromTab = async (tabId: number): Promise<PageContextPayload> => {
  const message: CollectPageContextMessage = {
    type: MESSAGE_TYPES.COLLECT_PAGE_CONTEXT,
  };
  const response = await chrome.tabs.sendMessage<CollectPageContextMessage, CollectPageContextResponse>(
    tabId,
    message,
  );

  if (!response?.ok || !response.data) {
    throw new Error(response?.error ?? '無法收集頁面情境。');
  }

  return response.data;
};

export const storePageContext = async (payload: PageContextPayload): Promise<ContextItem> => {
  const item = createContextItem(payload);
  await addContextItem(item);
  return item;
};

export const collectActiveTabContext = async (): Promise<ContextItem> => {
  const tabId = await getActiveTabId();
  const payload = await collectFromTab(tabId);
  return storePageContext(payload);
};
