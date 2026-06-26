import type { PageContextPayload } from '../types/context';
import type { MessageResponse } from '../types/messages';

const COLLECT_PAGE_CONTEXT = 'COLLECT_PAGE_CONTEXT';

const cleanOptionalText = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const collectPageContext = (): PageContextPayload => ({
  title: document.title,
  url: window.location.href,
  selectedText: cleanOptionalText(window.getSelection()?.toString()),
});

chrome.runtime.onMessage.addListener(
  (
    message: { type?: string },
    _sender,
    sendResponse: (response: MessageResponse<PageContextPayload>) => void,
  ) => {
    if (message.type !== COLLECT_PAGE_CONTEXT) {
      return false;
    }

    try {
      sendResponse({ ok: true, data: collectPageContext() });
    } catch (error) {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : '無法收集頁面情境。',
      });
    }

    return false;
  },
);
