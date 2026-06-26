import type { ContextItem } from '../types/context';

const emptyField = '無';

const formatTags = (tags: string[]): string => (tags.length > 0 ? tags.map((tag) => `#${tag}`).join(' ') : emptyField);

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
  return ['# AI 情境資料包', '', `> 匯出來源數：${items.length}`, '', sources].filter(Boolean).join('\n');
};
