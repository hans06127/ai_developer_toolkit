import type { ContextItem } from '../types/context';

const emptyField = '無';

const formatTags = (tags: string[]): string => (tags.length > 0 ? tags.map((tag) => `#${tag}`).join(' ') : emptyField);

const formatMetadata = (metadata: ContextItem['sourceMetadata']): string[] => {
  const entries = Object.entries(metadata ?? {}).filter(([, value]) => value);

  if (entries.length === 0) {
    return ['- 來源中繼資料：無'];
  }

  return ['- 來源中繼資料：', ...entries.map(([key, value]) => `  - ${key}：${value}`)];
};

const formatOptionalBlock = (label: string, value: string | undefined): string[] => [
  `### ${label}`,
  '',
  value ?? emptyField,
  '',
];

const formatSource = (item: ContextItem, index: number): string =>
  [
    `## ${index + 1}. ${item.title}`,
    '',
    `- 類型：${item.sourceType}`,
    `- URL：${item.url || emptyField}`,
    `- 標籤：${formatTags(item.tags ?? [])}`,
    `- 來源 Adapter：${item.sourceAdapterId}`,
    ...formatMetadata(item.sourceMetadata),
    `- 建立時間：${item.createdAt}`,
    item.updatedAt ? `- 更新時間：${item.updatedAt}` : undefined,
    '',
    ...formatOptionalBlock('選取文字', item.selectedText),
    ...formatOptionalBlock('筆記', item.note),
    '---',
  ]
    .filter((line): line is string => line !== undefined)
    .join('\n');

export const generateMarkdown = (items: ContextItem[]): string => {
  const sources = items.map(formatSource).join('\n\n');
  return ['# AI 情境資料包', '', `> 匯出來源數：${items.length}`, '> 隱私：資料僅儲存在本機瀏覽器。', '', sources]
    .filter(Boolean)
    .join('\n');
};
