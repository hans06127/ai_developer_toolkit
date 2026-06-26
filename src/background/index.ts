import { storePageContext } from '../services/contextService';
import { MESSAGE_TYPES, type ExtensionMessage, type StoreContextItemResponse } from '../types/messages';
import type { PageContextPayload } from '../types/context';
import { cleanOptionalText } from '../utils/text';

const CONTEXT_MENU_ID = 'add-to-ai-context';

const createContextMenu = (): void => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: '加入 AI 情境',
      contexts: ['page', 'selection'],
    });
  });
};

const getPayloadFromContextMenu = (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab,
): PageContextPayload => ({
  title: tab?.title ?? '未命名頁面',
  url: info.pageUrl ?? tab?.url ?? '',
  selectedText: cleanOptionalText(info.selectionText),
});

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }

  void storePageContext(getPayloadFromContextMenu(info, tab)).catch((error) => {
    console.error('無法加入 AI 情境。', error);
  });
});

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender,
    sendResponse: (response: StoreContextItemResponse) => void,
  ) => {
    if (message.type !== MESSAGE_TYPES.STORE_CONTEXT_ITEM) {
      return false;
    }

    storePageContext(message.payload)
      .then((item) => {
        sendResponse({ ok: true, data: item });
      })
      .catch((error) => {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : '無法儲存頁面情境。',
        });
      });

    return true;
  },
);
