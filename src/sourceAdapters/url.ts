export const parseUrl = (value: string): URL | null => {
  try {
    return value ? new URL(value) : null;
  } catch {
    return null;
  }
};

export const getLastPathSegment = (url: URL): string | undefined =>
  url.pathname.split('/').filter(Boolean).at(-1);
