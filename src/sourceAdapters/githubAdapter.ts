import type { SourceAdapter } from './types';
import { parseUrl } from './url';

export const githubAdapter: SourceAdapter = {
  id: 'github-url',
  label: 'GitHub',
  match: (payload) => {
    const url = parseUrl(payload.url);

    if (!url || url.hostname !== 'github.com') {
      return null;
    }

    const [owner, repo, area, identifier, ...rest] = url.pathname.split('/').filter(Boolean);

    if (!owner || !repo) {
      return null;
    }

    const sourceType = area === 'issues' || area === 'pull' ? 'issue' : area === 'blob' || area === 'tree' ? 'code' : 'github';
    const metadata = {
      platform: 'GitHub',
      owner,
      repo,
      area: area ?? 'repository',
      identifier: identifier ?? '',
      path: rest.join('/'),
      ref: area === 'blob' || area === 'tree' ? identifier ?? '' : '',
    };

    return {
      sourceType,
      adapterId: 'github-url',
      metadata,
      tags: ['github', owner, repo, area].filter((tag): tag is string => Boolean(tag)),
    };
  },
};
