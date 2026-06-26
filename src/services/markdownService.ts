import type { ContextItem } from '../types/context';

const emptyField = 'None';

const formatSource = (item: ContextItem, index: number): string =>
  [
    `## Source ${index + 1}`,
    '',
    `Title: ${item.title}`,
    '',
    `URL: ${item.url}`,
    '',
    `Created At: ${item.createdAt}`,
    '',
    'Selected Text:',
    '',
    item.selectedText ?? emptyField,
    '',
    '---',
  ].join('\n');

export const generateMarkdown = (items: ContextItem[]): string => {
  const sources = items.map(formatSource).join('\n\n');
  return ['# AI Context', '', sources].filter(Boolean).join('\n');
};
