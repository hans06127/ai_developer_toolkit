export const zhTW = {
  appEyebrow: 'AI Developer Toolkit',
  appTitle: '情境收集器',
  collectPage: '收集頁面',
  copyMarkdown: '複製 Markdown',
  clear: '清空',
  loading: '載入情境中…',
  empty: '尚未收集任何情境。',
  markdownCopied: '已複製 Markdown。',
  copyFailed: '複製失敗。',
  deleteItem: '刪除此項目',
  untitledPage: '未命名頁面',
  notePlaceholder: '補充筆記：為什麼這個來源重要？',
  tagsPlaceholder: '標籤，以逗號分隔',
  saveDetails: '儲存',
  sourceTypeLabel: '來源類型',
  sourceAdapter: '來源 Adapter',
  privacyLocalOnly: '隱私優先：資料只儲存在本機瀏覽器。',
  selectedText: '選取文字',
  note: '筆記',
  tags: '標籤',
} as const;

export type TranslationKey = keyof typeof zhTW;
