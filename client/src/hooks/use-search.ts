import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface SearchResult {
  chapter: number;
  verse: number;
  preview: string;
  type: 'chapter' | 'verse' | 'keyword';
  content?: {
    slok: string;
    transliteration: string;
    translation: string;
  };
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
 * - Direct number (e.g., "23" will show both chapter 23 and any verse containing 23)
 * - Chapter number (e.g., "chapter 1" or "ch 1")
 * - Verse reference (e.g., "1:1" or "1.1")
 * - Keywords (future implementation)
 */
export function useSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Parse query to determine search type and parameters
  const parseQuery = (q: string): { 
    type: 'chapter' | 'verse' | 'keyword';
    chapter?: number;
    verse?: number;
    term?: string;
  } => {
    // Direct number search
    const numberOnly = q.match(/^(\d+)$/);
    if (numberOnly) {
      const num = parseInt(numberOnly[1]);
      // If number could be a chapter (1-18)
      if (num > 0 && num <= 18) {
        return { type: 'chapter', chapter: num };
      }
      // Otherwise search for verses containing this number
      return { type: 'keyword', term: numberOnly[1] };
    }

    // Chapter format (e.g., "chapter 1" or "ch 1")
    const chapterMatch = q.match(/^(?:chapter|ch\.?)\s*(\d+)$/i);
    if (chapterMatch) {
      return { type: 'chapter', chapter: parseInt(chapterMatch[1]) };
    }

    // Verse format (e.g., "1:1", "1.1", or "1 1")
    const verseMatch = q.match(/^(\d+)[\s:.](\d+)$/);
    if (verseMatch) {
      return {
        type: 'verse',
        chapter: parseInt(verseMatch[1]),
        verse: parseInt(verseMatch[2])
      };
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

          // Add both chapter info and first verse
          results = [
            {
              chapter: parsed.chapter!,
              verse: 1,
              preview: `${data.name} - ${data.name_meaning}`,
              type: 'chapter'
            }
          ];

          // Also fetch first verse for preview
          const verseResponse = await fetch(`https://vedicscriptures.github.io/slok/${parsed.chapter}/1`);
          if (verseResponse.ok) {
            const verseData: VerseData = await verseResponse.json();
            results[0].content = {
              slok: verseData.slok,
              transliteration: verseData.transliteration,
              translation: verseData.tej.ht
            };
          }
        } 
        else if (parsed.type === 'verse') {
          const response = await fetch(`https://vedicscriptures.github.io/slok/${parsed.chapter}/${parsed.verse}`);
          if (!response.ok) throw new Error('Failed to fetch verse');
          const data: VerseData = await response.json();
          results = [{
            chapter: parsed.chapter!,
            verse: parsed.verse!,
            preview: data.transliteration,
            type: 'verse',
            content: {
              slok: data.slok,
              transliteration: data.transliteration,
              translation: data.tej.ht
            }
          }];
        }
        else if (parsed.type === 'keyword' && parsed.term?.match(/^\d+$/)) {
          // Search for verses containing the number
          const num = parseInt(parsed.term);
          // Search in first few chapters (for demo)
          for (let chapter = 1; chapter <= 18; chapter++) {
            const response = await fetch(`https://vedicscriptures.github.io/chapters/${chapter}`);
            if (response.ok) {
              const data: ChapterData = await response.json();
              for (let verse = 1; verse <= data.verses_count; verse++) {
                if (verse === num) {
                  const verseResponse = await fetch(`https://vedicscriptures.github.io/slok/${chapter}/${verse}`);
                  if (verseResponse.ok) {
                    const verseData: VerseData = await verseResponse.json();
                    results.push({
                      chapter,
                      verse,
                      preview: verseData.transliteration,
                      type: 'verse',
                      content: {
                        slok: verseData.slok,
                        transliteration: verseData.transliteration,
                        translation: verseData.tej.ht
                      }
                    });
                  }
                }
              }
            }
          }
        }

        return results;
      } catch (error) {
        console.error('Search error:', error);
        return [];
      }
    },
    enabled: debouncedQuery.length > 0
  });
}