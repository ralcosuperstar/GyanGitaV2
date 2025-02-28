import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface SearchResult {
  chapter: number;
  verse: number;
  preview: string;
  type: 'chapter' | 'verse' | 'keyword';
}

interface ChapterData {
  chapter_number: number;
  name: string;
  name_meaning: string;
  verses_count: number;
}

interface VerseData {
  slok: string;
  transliteration: string;
  tej: {
    ht: string;
    et: string;
  };
}

/**
 * Custom hook for searching Bhagavad Gita verses
 * Supports searching by:
 * - Chapter number (e.g., "chapter 1" or "1")
 * - Verse reference (e.g., "1:1" or "1.1")
 * - Keywords (future implementation)
 * 
 * @param query Search query string
 * @returns Search results and loading state
 */
export function useSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Parse query to determine if it's a chapter, verse, or keyword search
  const parseQuery = (q: string): { 
    type: 'chapter' | 'verse' | 'keyword';
    chapter?: number;
    verse?: number;
    term?: string;
  } => {
    // Check for chapter format (e.g., "chapter 1" or "ch 1")
    const chapterMatch = q.match(/^(?:chapter|ch\.?)\s*(\d+)$/i);
    if (chapterMatch) {
      return { type: 'chapter', chapter: parseInt(chapterMatch[1]) };
    }

    // Check for verse format (e.g., "1:1", "1.1", or "1 1")
    const verseMatch = q.match(/^(\d+)[\s:.](\d+)$/);
    if (verseMatch) {
      return {
        type: 'verse',
        chapter: parseInt(verseMatch[1]),
        verse: parseInt(verseMatch[2])
      };
    }

    // If it's a single number, treat it as a chapter
    const numberMatch = q.match(/^(\d+)$/);
    if (numberMatch) {
      return { type: 'chapter', chapter: parseInt(numberMatch[1]) };
    }

    // Default to keyword search
    return { type: 'keyword', term: q };
  };

  return useQuery<SearchResult[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];

      const parsed = parseQuery(debouncedQuery);
      let results: SearchResult[] = [];

      try {
        if (parsed.type === 'chapter') {
          const response = await fetch(`https://vedicscriptures.github.io/chapters/${parsed.chapter}`);
          if (!response.ok) throw new Error('Failed to fetch chapter');
          const data: ChapterData = await response.json();
          results = [{
            chapter: parsed.chapter!,
            verse: 1,
            preview: data.name,
            type: 'chapter'
          }];
        } 
        else if (parsed.type === 'verse') {
          const response = await fetch(`https://vedicscriptures.github.io/slok/${parsed.chapter}/${parsed.verse}`);
          if (!response.ok) throw new Error('Failed to fetch verse');
          const data: VerseData = await response.json();
          results = [{
            chapter: parsed.chapter!,
            verse: parsed.verse!,
            preview: data.transliteration,
            type: 'verse'
          }];
        }
        // TODO: Implement keyword search when API supports it

        return results;
      } catch (error) {
        console.error('Search error:', error);
        return [];
      }
    },
    enabled: debouncedQuery.length > 0
  });
}