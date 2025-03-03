import { type VerseResponse } from "@/types/verse";

interface QuoteStyle {
  language: 'sanskrit' | 'english' | 'hindi';
  includeTranslation: boolean;
}

interface GeneratedQuote {
  text: string;
  html: string;
  socialText: string;
}

export function generateQuote(verse: VerseResponse, style: QuoteStyle): GeneratedQuote {
  const { chapter, verse: verseNumber, slok, transliteration, tej } = verse;

  // Get the main text based on language
  let mainText = '';
  let translation = '';

  switch (style.language) {
    case 'sanskrit':
      mainText = slok;
      translation = tej.ht || tej.et;
      break;
    case 'english':
      mainText = tej.et || transliteration;
      translation = tej.ht;
      break;
    case 'hindi':
      mainText = tej.ht;
      translation = tej.et;
      break;
  }

  // Format attribution
  const attribution = `- Bhagavad Gita, Chapter ${chapter}, Verse ${verseNumber}`;

  // Generate formatted text
  const textQuote = style.includeTranslation 
    ? `${mainText}\n\n${translation}\n\n${attribution}`
    : `${mainText}\n\n${attribution}`;

  // Generate HTML version with proper styling
  const htmlQuote = `
    <div class="quote-container p-6 space-y-4">
      <div class="text-lg font-medium leading-relaxed break-words">${mainText}</div>
      ${style.includeTranslation ? `<div class="text-muted-foreground leading-relaxed break-words">${translation}</div>` : ''}
      <div class="text-sm text-primary">${attribution}</div>
    </div>
  `;

  // Generate social media optimized text (limited to ~200 chars)
  const socialText = `${mainText.substring(0, 180)}${mainText.length > 180 ? '...' : ''}\n${attribution}\n\nDiscover more on GyanGita`;

  return {
    text: textQuote,
    html: htmlQuote,
    socialText
  };
}