import { type VerseResponse } from "@/types/verse";

interface QuoteStyle {
  template: 'minimal' | 'decorative' | 'traditional';
  language: 'sanskrit' | 'english' | 'hindi';
  showAttribution: boolean;
}

interface GeneratedQuote {
  text: string;
  html: string;
  socialText: string;
}

export function generateQuote(verse: VerseResponse, style: QuoteStyle): GeneratedQuote {
  const { chapter, verse: verseNumber, slok, transliteration, tej } = verse;
  
  // Get the appropriate text based on language
  let mainText = '';
  let attribution = '';
  
  switch (style.language) {
    case 'sanskrit':
      mainText = slok;
      break;
    case 'english':
      mainText = tej.et || transliteration;
      break;
    case 'hindi':
      mainText = tej.ht;
      break;
  }

  // Format attribution
  attribution = `- Bhagavad Gita, Chapter ${chapter}, Verse ${verseNumber}`;

  // Generate formatted text for different platforms
  const textQuote = `"${mainText}"\n\n${attribution}\n\nShared via GyanGita`;
  
  // Generate HTML version with styling
  const htmlQuote = `
    <div class="quote-${style.template}">
      <div class="quote-text">${mainText}</div>
      ${style.showAttribution ? `<div class="quote-attribution">${attribution}</div>` : ''}
      <div class="quote-branding">Shared via GyanGita</div>
    </div>
  `;

  // Generate social media optimized text
  const socialText = `"${mainText.substring(0, 200)}${mainText.length > 200 ? '...' : ''}"
${attribution}

Discover more wisdom at GyanGita
#BhagavadGita #Spirituality #Wisdom`;

  return {
    text: textQuote,
    html: htmlQuote,
    socialText
  };
}
