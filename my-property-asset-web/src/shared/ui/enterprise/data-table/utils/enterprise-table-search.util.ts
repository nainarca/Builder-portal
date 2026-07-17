export interface SearchHighlightSegment {
  readonly text: string;
  readonly match: boolean;
}

export function splitSearchHighlight(text: string, query: string): SearchHighlightSegment[] {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return [{ text, match: false }];
  }

  const escaped = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex).filter((part) => part.length > 0);

  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === normalizedQuery.toLowerCase(),
  }));
}

export function matchesInstantSearch(
  haystack: string,
  query: string,
  options?: { caseSensitive?: boolean },
): boolean {
  const needle = query.trim();
  if (!needle) {
    return true;
  }
  if (options?.caseSensitive) {
    return haystack.includes(needle);
  }
  return haystack.toLowerCase().includes(needle.toLowerCase());
}
