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
        console.log("Searching with query:", debouncedQuery, "parsed as:", parsed);
        
        // For numeric search, we'll check both chapters and verses
        if (parsed.type === 'keyword' || parsed.type === 'chapter') {
          // If it's a direct number or explicitly a chapter
          const numericQuery = parsed.type === 'chapter' ? 
            parsed.chapter?.toString() : 
            parsed.term?.match(/^\d+$/) ? parsed.term : null;
            
          if (numericQuery) {
            const num = parseInt(numericQuery);
            
            // If number could be a chapter (1-18), add it to results
            if (num > 0 && num <= 18) {
              try {
                const chaptersResponse = await fetch('/api/chapters');
                if (chaptersResponse.ok) {
                  const chaptersData = await chaptersResponse.json();
                  const matchingChapter = chaptersData.find((ch: any) => ch.chapter_number === num);
                  
                  if (matchingChapter) {
                    results.push({
                      chapter: num,
                      preview: `Chapter ${num}: ${matchingChapter.name} - ${matchingChapter.verses_count} verses`,
                      type: 'chapter',
                      content: {
                        slok: `Chapter ${num}: ${matchingChapter.name}`,
                        transliteration: matchingChapter.name_meaning || '',
                        translation: `This chapter contains ${matchingChapter.verses_count} verses.`
                      }
                    });
                  }
                }
                
                // Also add any verses that match this number
                for (let chapter = 1; chapter <= 18; chapter++) {
                  try {
                    if (num <= 78) { // Most chapters have fewer than 78 verses
                      const verseResponse = await fetch(`/api/verse/${chapter}/${num}`);
                      if (verseResponse.ok) {
                        const verseData = await verseResponse.json();
                        results.push({
                          chapter,
                          verse: num,
                          preview: `${chapter}:${num} - ${verseData.tej.et.substring(0, 50)}...`,
                          type: 'verse',
                          content: {
                            slok: verseData.slok,
                            transliteration: verseData.transliteration,
                            translation: verseData.tej.et
                          }
                        });
                      }
                    }
                  } catch (e) {
                    // Verse might not exist for this chapter, continue
                  }
                }
              } catch (error) {
                console.error("Error fetching chapter data:", error);
              }
            }
          }
        } else if (parsed.type === 'verse' && parsed.chapter && parsed.verse) {
          // Direct verse reference (e.g., "1:1" or "1.1")
          try {
            const verseResponse = await fetch(`/api/verse/${parsed.chapter}/${parsed.verse}`);
            if (verseResponse.ok) {
              const verseData = await verseResponse.json();
              results.push({
                chapter: parsed.chapter,
                verse: parsed.verse,
                preview: `${parsed.chapter}:${parsed.verse} - ${verseData.tej.et.substring(0, 50)}...`,
                type: 'verse',
                content: {
                  slok: verseData.slok,
                  transliteration: verseData.transliteration,
                  translation: verseData.tej.et
                }
              });
            }
          } catch (error) {
            console.error(`Error fetching verse ${parsed.chapter}:${parsed.verse}:`, error);
          }
        }

              // Fetch first verse for preview
              const verseResponse = await fetch(`https://vedicscriptures.github.io/slok/${num}/1`);
              if (verseResponse.ok) {
                const verseData: VerseData = await verseResponse.json();
                results.push({
                  chapter: num,
                  verse: 1,
                  preview: `${chapterData.name} - ${chapterData.name_meaning}`,
                  type: 'chapter',
                  content: {
                    slok: verseData.slok,
                    transliteration: verseData.transliteration,
                    translation: verseData.tej.ht
                  }
                });
              }
            }
          }

          // Search for verses with this number
          for (let chapter = 1; chapter <= 18; chapter++) {
            const chapterResponse = await fetch(`https://vedicscriptures.github.io/chapters/${chapter}`);
            if (chapterResponse.ok) {
              const chapterData: ChapterData = await chapterResponse.json();
              if (num <= chapterData.verses_count) {
                const verseResponse = await fetch(`https://vedicscriptures.github.io/slok/${chapter}/${num}`);
                if (verseResponse.ok) {
                  const verseData: VerseData = await verseResponse.json();
                  results.push({
                    chapter,
                    verse: num,
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
        else if (parsed.type === 'chapter') {
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

        // Filter for numerical search (like "23")
        if (/^\d+$/.test(debouncedQuery)) {
          const numQuery = debouncedQuery;
          // Filter results to include chapter numbers or verse numbers that match the query
          results = results.filter(result => 
            result.chapter.toString().includes(numQuery) || 
            (result.verse && result.verse.toString().includes(numQuery))
          );
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