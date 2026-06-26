import { addContextItem } from '../storage/contextStorage';
import {
  MESSAGE_TYPES,
  type CollectPageContextMessage,
  type CollectPageContextResponse,
} from '../types/messages';
import type { ContextItem, PageContextPayload } from '../types/context';
import { cleanOptionalText } from '../utils/text';
import { createId } from '../utils/id';

const createContextItem = (payload: PageContextPayload): ContextItem => ({
  id: createId(),
  title: payload.title.trim() || 'Untitled Page',
  url: payload.url,
  selectedText: cleanOptionalText(payload.selectedText),
  createdAt: new Date().toISOString(),
});

const getActiveTabId = async (): Promise<number> => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    throw new Error('No active tab is available.');
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
    throw new Error(response?.error ?? 'Unable to collect page context.');
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
