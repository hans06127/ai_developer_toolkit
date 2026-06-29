import type { SourceAdapter } from './types';
import { parseUrl } from './url';

const openApiHints = ['swagger', 'openapi', 'api-docs', 'redoc', 'rapidoc'];

export const openApiAdapter: SourceAdapter = {
  id: 'openapi-url',
  label: 'Swagger / OpenAPI',
  match: (payload) => {
    const url = parseUrl(payload.url);

    if (!url) {
      return null;
    }

    const haystack = `${url.hostname} ${url.pathname} ${payload.title}`.toLowerCase();

    if (!openApiHints.some((hint) => haystack.includes(hint))) {
      return null;
    }

    return {
      sourceType: 'openapi',
      adapterId: 'openapi-url',
      metadata: {
        platform: 'Swagger / OpenAPI',
        host: url.hostname,
        path: url.pathname,
        query: url.search,
        title: payload.title,
      },
      tags: ['openapi', 'api-docs'],
    };
  },
};
