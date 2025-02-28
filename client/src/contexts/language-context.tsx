import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.browse': 'Browse',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.search': 'Search',

    // Search
    'search.title': 'Search Bhagavad Gita',
    'search.description': 'Search by chapter, verse, or keywords',
    'search.placeholder': 'Type chapter number, verse number, or keywords...',
    'search.loading': 'Searching',
    'search.no_results': 'No results found',

    // Home page
    'home.title': 'Divine Wisdom for Modern Life\'s Challenges',
    'home.subtitle': 'Navigate life\'s journey with timeless guidance from the Bhagavad Gita',
    'home.cta.find': 'Find Guidance',
    'home.cta.share': 'Share on WhatsApp',

    // Stats
    'stats.chapters': 'Sacred Chapters',
    'stats.verses': 'Divine Verses',
    'stats.states': 'Emotional States',
    'stats.translations': 'Expert Translations',

    // Features
    'features.personal.title': 'Personalized Guidance',
    'features.personal.desc': 'Receive verses that resonate with your current emotional state',
    'features.ancient.title': 'Ancient Wisdom',
    'features.ancient.desc': 'Access profound teachings with expert translations',
    'features.daily.title': 'Daily Inspiration',
    'features.daily.desc': 'Transform challenges into opportunities',
  },
  hi: {
    // Navigation
    'nav.browse': 'ब्राउज़ करें',
    'nav.about': 'परिचय',
    'nav.contact': 'संपर्क करें',
    'nav.search': 'खोजें',

    // Search
    'search.title': 'भगवद गीता खोजें',
    'search.description': 'अध्याय, श्लोक, या कीवर्ड द्वारा खोजें',
    'search.placeholder': 'अध्याय संख्या, श्लोक संख्या, या कीवर्ड टाइप करें...',
    'search.loading': 'खोज रहे हैं',
    'search.no_results': 'कोई परिणाम नहीं मिला',

    // Home page
    'home.title': 'आधुनिक जीवन की चुनौतियों के लिए दैवीय ज्ञान',
    'home.subtitle': 'भगवद गीता के शाश्वत मार्गदर्शन के साथ जीवन की यात्रा करें',
    'home.cta.find': 'मार्गदर्शन प्राप्त करें',
    'home.cta.share': 'व्हाट्सएप पर शेयर करें',

    // Stats
    'stats.chapters': 'पवित्र अध्याय',
    'stats.verses': 'दिव्य श्लोक',
    'stats.states': 'भावनात्मक स्थितियां',
    'stats.translations': 'विशेषज्ञ अनुवाद',

    // Features
    'features.personal.title': 'व्यक्तिगत मार्गदर्शन',
    'features.personal.desc': 'अपनी वर्तमान भावनात्मक स्थिति के अनुरूप श्लोक प्राप्त करें',
    'features.ancient.title': 'प्राचीन ज्ञान',
    'features.ancient.desc': 'विशेषज्ञ अनुवादों के साथ गहन शिक्षाएं',
    'features.daily.title': 'दैनिक प्रेरणा',
    'features.daily.desc': 'चुनौतियों को अवसरों में बदलें',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const lang = translations[language];
    return lang[key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}