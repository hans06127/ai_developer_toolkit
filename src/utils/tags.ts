export const normalizeTags = (tags: string[] | undefined): string[] => {
  const normalizedTags = tags
    ?.map((tag) => tag.trim().replace(/^#/, '').toLowerCase())
    .filter(Boolean);

  return [...new Set(normalizedTags ?? [])];
};

export const parseTags = (value: string): string[] => normalizeTags(value.split(','));

export const formatTags = (tags: string[]): string => tags.join(', ');
