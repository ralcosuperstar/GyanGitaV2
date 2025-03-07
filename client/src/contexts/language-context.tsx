import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.browse': 'Browse',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.search': 'Search',
    'nav.home': 'Home',
    'nav.bookmarks': 'Bookmarks',

    // Bookmarks page
    'bookmarks.title': 'My Bookmarked Verses',
    'bookmarks.subtitle': 'Your personal collection of sacred verses',
    'bookmarks.empty.title': 'No bookmarks yet',
    'bookmarks.empty.description': 'Start exploring verses and bookmark your favorites for quick access',
    'bookmarks.empty.action': 'Browse Verses',

    // Search
    'search.title': 'Search Bhagavad Gita',
    'search.description': 'Search by chapter, verse, or keywords',
    'search.placeholder': 'Type chapter number, verse number, or keywords...',
    'search.loading': 'Searching',
    'search.no_results': 'No results found',
    'search.start_typing': 'Start typing to search verses...',

    // Home page
    'home.title': "Life's a Mess? Let the Bhagavad Gita Sort It Out",
    'home.subtitle': 'From tough days to big wins, find the Bhagavad Gita verse that speaks to you right now',
    'home.cta.find': 'Find Guidance',
    'home.cta.share': 'Share on WhatsApp',
    'home.mood.title': 'How are you feeling today?',
    'home.mood.change': 'Choose Another Mood',
    'home.explore': 'Explore More Verses',
    'home.share.text': 'Discover divine wisdom from Bhagavad Gita for your daily challenges at GyanGita! 🕉️\n\nFind spiritual guidance tailored to your emotional state.',
    'home.daily.title': "Today's Verse",
    'home.daily.subtitle': 'Start your day with divine wisdom from the Bhagavad Gita',
    'home.sections.daily': "Today's Verse",
    'home.sections.popular': 'Popular Verses',

    // Stats
    'stats.chapters': 'Sacred Chapters',
    'stats.verses': 'Divine Verses',
    'stats.states': 'Emotional States',
    'stats.translations': 'Expert Translations',
    'stats.years': 'Years of Wisdom',

    // Features
    'features.personal.title': 'Personalized Guidance',
    'features.personal.desc': 'Receive verses that resonate with your current emotional state',
    'features.ancient.title': 'Ancient Wisdom',
    'features.ancient.desc': 'Access profound teachings with expert translations',
    'features.daily.title': 'Daily Inspiration',
    'features.daily.desc': 'Transform challenges into opportunities',
    'features.mood.title': 'Mood-Based Recommendations',
    'features.mood.desc': 'Find verses that specifically address your current emotional state',
    'features.perspectives.title': 'Multiple Perspectives',
    'features.perspectives.desc': 'Gain deeper understanding through various interpretations',

    // Browse page
    'browse.title': 'Explore Sacred Verses',
    'browse.subtitle': 'Delve into the timeless wisdom of the Bhagavad Gita, verse by verse',
    'browse.search.title': 'Search Verses',
    'browse.chapters.title': 'Browse Chapters',
    'browse.select.chapter': 'Select Chapter',
    'browse.select.verse': 'Enter Verse Number',
    'browse.verses': 'verses',
    'browse.back': '← Back to Chapters',

    // About page
    'about.title': 'About GyanGita',
    'about.subtitle': 'Your spiritual companion for discovering the timeless wisdom of Bhagavad Gita',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'GyanGita aims to make the profound wisdom of Bhagavad Gita accessible and relevant to modern life. We understand that different emotional states call for different spiritual guidance, which is why we\'ve created this unique mood-based approach to exploring the sacred text.',
    'about.how.title': 'How It Works',
    'about.how.desc': 'Simply select your current mood, and GyanGita will present you with carefully chosen verses from the Bhagavad Gita that address your emotional state. Each verse comes with both Sanskrit text and English translation to ensure complete understanding.',
    'about.text.title': 'The Sacred Text',
    'about.text.desc': 'The Bhagavad Gita, often referred to as the Bhagavad Gita, is a 700-verse Sanskrit scripture that is part of the epic Mahabharata. It contains a conversation between Prince Arjuna and Lord Krishna, who serves as his charioteer. Through this dialogue, the text presents a comprehensive worldview and path to spiritual liberation.',
    'about.credits.title': 'API Credits',
    'about.credits.desc': 'We are grateful to Pt. Prashant Tripathi and their team for providing the comprehensive Bhagavad Gita API that powers this application.',

    // Contact page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Have questions or feedback? We\'d love to hear from you.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.get_in_touch': 'Get in Touch',
    'contact.response_time': 'Response within 24 hours',

    // Verse display
    'verse.sanskrit': 'Sanskrit',
    'verse.transliteration': 'Transliteration',
    'verse.translation': 'Translation',
    'verse.commentary': 'Commentary',
    'verse.text': 'Original Text',
    'verse.translations': 'Translations',
    'verse.related': 'Related Verses',
    'verse.readMore': 'Read More',
    'verse.bookmark': 'Bookmark',
    'verse.bookmarked': 'Bookmarked',
    'verse.shareAction': 'Share', 
    'verse.noCommentary': 'No commentary available.',
    'verse.relatedVerses': 'Related Verses',
    'verse.noRelatedVerses': 'No related verses available.',
    'verse.verseNumber': 'Chapter {chapter}, Verse {verse}',
    'verse.share': 'Share on WhatsApp', 
  },
  hi: {
    // Navigation
    'nav.browse': 'ब्राउज़ करें',
    'nav.about': 'परिचय',
    'nav.contact': 'संपर्क करें',
    'nav.search': 'खोजें',
    'nav.home': 'होम',
    'nav.bookmarks': 'बुकमार्क',

    // Bookmarks page
    'bookmarks.title': 'मेरे बुकमार्क किए गए श्लोक',
    'bookmarks.subtitle': 'आपका व्यक्तिगत पवित्र श्लोक संग्रह',
    'bookmarks.empty.title': 'अभी तक कोई बुकमार्क नहीं',
    'bookmarks.empty.description': 'श्लोकों का अन्वेषण करें और त्वरित पहुंच के लिए अपने पसंदीदा को बुकमार्क करें',
    'bookmarks.empty.action': 'श्लोक ब्राउज़ करें',

    // Search
    'search.title': 'भगवद्गीता खोजें',
    'search.description': 'अध्याय, श्लोक, या कीवर्ड द्वारा खोजें',
    'search.placeholder': 'अध्याय संख्या, श्लोक संख्या, या कीवर्ड टाइप करें...',
    'search.loading': 'खोज रहे हैं',
    'search.no_results': 'कोई परिणाम नहीं मिला',
    'search.start_typing': 'श्लोक खोजने के लिए टाइप करें...',

    // Home page
    'home.title': 'जीवन में परेशान हैं? भगवद्गीता आपका मार्गदर्शन करेगी',
    'home.subtitle': 'कठिन दिनों से लेकर बड़ी सफलता तक, भगवद्गीता का वह श्लोक खोजें जो आपसे सीधे बात करता है',
    'home.cta.find': 'मार्गदर्शन प्राप्त करें',
    'home.cta.share': 'व्हाट्सएप पर शेयर करें',
    'home.mood.title': 'आज आप कैसा महसूस कर रहे हैं?',
    'home.mood.change': 'दूसरा भाव चुनें',
    'home.explore': 'और श्लोक खोजें',
    'home.share.text': 'ज्ञानगीता पर अपनी दैनिक चुनौतियों के लिए भगवद्गीता का दिव्य ज्ञान खोजें! 🕉️\n\nअपनी भावनात्मक स्थिति के अनुरूप आध्यात्मिक मार्गदर्शन प्राप्त करें।',
    'home.daily.title': 'आज का श्लोक',
    'home.daily.subtitle': 'भगवद्गीता के दिव्य ज्ञान के साथ अपने दिन की शुरुआत करें',
    'home.sections.daily': 'आज का श्लोक',
    'home.sections.popular': 'लोकप्रिय श्लोक',

    // Stats
    'stats.chapters': 'पवित्र अध्याय',
    'stats.verses': 'दिव्य श्लोक',
    'stats.states': 'भावनात्मक स्थितियां',
    'stats.translations': 'विशेषज्ञ अनुवाद',
    'stats.years': 'वर्षों का ज्ञान',

    // Features
    'features.personal.title': 'व्यक्तिगत मार्गदर्शन',
    'features.personal.desc': 'अपनी वर्तमान भावनात्मक स्थिति के अनुरूप श्लोक प्राप्त करें',
    'features.ancient.title': 'प्राचीन ज्ञान',
    'features.ancient.desc': 'विशेषज्ञ अनुवादों के साथ गहन शिक्षाएं',
    'features.daily.title': 'दैनिक प्रेरणा',
    'features.daily.desc': 'चुनौतियों को अवसरों में बदलें',
    'features.mood.title': 'भाव-आधारित सिफारिशें',
    'features.mood.desc': 'अपनी वर्तमान भावनात्मक स्थिति के अनुरूप श्लोक खोजें',
    'features.perspectives.title': 'विभिन्न दृष्टिकोण',
    'features.perspectives.desc': 'विभिन्न व्याख्याओं के माध्यम से गहरी समझ प्राप्त करें',

    // Browse page
    'browse.title': 'पवित्र श्लोकों का अन्वेषण करें',
    'browse.subtitle': 'भगवद्गीता के शाश्वत ज्ञान को श्लोक दर श्लोक जानें',
    'browse.search.title': 'श्लोक खोजें',
    'browse.chapters.title': 'अध्याय ब्राउज़ करें',
    'browse.select.chapter': 'अध्याय चुनें',
    'browse.select.verse': 'श्लोक संख्या दर्ज करें',
    'browse.verses': 'श्लोक',
    'browse.back': '← अध्यायों पर वापस जाएं',

    // About page
    'about.title': 'ज्ञानगीता के बारे में',
    'about.subtitle': 'भगवद्गीता के शाश्वत ज्ञान की खोज में आपका आध्यात्मिक साथी',
    'about.mission.title': 'हमारा उद्देश्य',
    'about.mission.desc': 'ज्ञानगीता का उद्देश्य भगवद्गीता के गहन ज्ञान को आधुनिक जीवन के लिए सुलभ और प्रासंगिक बनाना है। हम समझते हैं कि विभिन्न भावनात्मक स्थितियों के लिए अलग-अलग आध्यात्मिक मार्गदर्शन की आवश्यकता होती है, इसीलिए हमने पवित्र ग्रंथ की खोज के लिए यह अनूठा भाव-आधारित दृष्टिकोण बनाया है।',
    'about.how.title': 'यह कैसे काम करता है',
    'about.how.desc': 'बस अपना वर्तमान भाव चुनें, और ज्ञानगीता आपकी भावनात्मक स्थिति के अनुरूप भगवद्गीता के सावधानीपूर्वक चुने गए श्लोक प्रस्तुत करेगा। पूर्ण समझ सुनिश्चित करने के लिए प्रत्येक श्लोक संस्कृत पाठ और हिंदी अनुवाद के साथ आता है।',
    'about.text.title': 'पवित्र ग्रंथ',
    'about.text.desc': 'भगवद्गीता, जिसे आमतौर पर गीता के नाम से जाना जाता है, महाभारत का एक 700-श्लोकीय संस्कृत ग्रंथ है। इसमें राजकुमार अर्जुन और उनके सारथी भगवान कृष्ण के बीच एक संवाद है। इस संवाद के माध्यम से, ग्रंथ एक व्यापक विश्व दृष्टिकोण और आध्यात्मिक मुक्ति का मार्ग प्रस्तुत करता है।',
    'about.credits.title': 'एपीआई श्रेय',
    'about.credits.desc': 'हम पं. प्रशांत त्रिपाठी और उनकी टीम के आभारी हैं जिन्होंने इस एप्लिकेशन को संचालित करने वाली व्यापक भगवद्गीता एपीआई प्रदान की।',

    // Contact page
    'contact.title': 'संपर्क करें',
    'contact.subtitle': 'प्रश्न या प्रतिक्रिया है? हम आपसे सुनना चाहेंगे।',
    'contact.form.name': 'नाम',
    'contact.form.email': 'ईमेल',
    'contact.form.message': 'संदेश',
    'contact.form.submit': 'संदेश भेजें',
    'contact.get_in_touch': 'संपर्क में रहें',
    'contact.response_time': '24 घंटे के भीतर प्रतिक्रिया',

    // Verse display in Hindi
    'verse.sanskrit': 'संस्कृत',
    'verse.transliteration': 'लिप्यंतरण',
    'verse.translation': 'अनुवाद',
    'verse.commentary': 'व्याख्या',
    'verse.text': 'मूल श्लोक',
    'verse.translations': 'अनुवाद',
    'verse.related': 'संबंधित',
    'verse.readMore': 'और पढ़ें',
    'verse.bookmark': 'बुकमार्क करें',
    'verse.bookmarked': 'बुकमार्क किया गया',
    'verse.shareAction': 'साझा करें', 
    'verse.noCommentary': 'कोई व्याख्या उपलब्ध नहीं है।',
    'verse.relatedVerses': 'संबंधित श्लोक',
    'verse.noRelatedVerses': 'कोई संबंधित श्लोक उपलब्ध नहीं है।',
    'verse.verseNumber': 'अध्याय {chapter}, श्लोक {verse}',
    'verse.share': 'व्हाट्सएप पर शेयर करें', 
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, params?: Record<string, string | number>): string => {
    const lang = translations[language];
    let text = lang[key as keyof typeof translations['en']] || key;

    // Replace parameters if they exist
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }

    return text;
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