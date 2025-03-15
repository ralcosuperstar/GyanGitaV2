import { Analytics } from '@segment/analytics-next';

// Initialize analytics with your Segment write key
export const analytics = new Analytics({
  writeKey: process.env.VITE_SEGMENT_WRITE_KEY || ''
});

// User engagement events
export const trackEngagement = {
  verseView: (chapter: number, verse: number) => {
    analytics.track('Verse Viewed', { chapter, verse });
  },
  moodSelected: (mood: string) => {
    analytics.track('Mood Selected', { mood });
  },
  shareVerse: (chapter: number, verse: number, platform: string) => {
    analytics.track('Verse Shared', { chapter, verse, platform });
  },
  bookmarkVerse: (chapter: number, verse: number) => {
    analytics.track('Verse Bookmarked', { chapter, verse });
  },
  premiumFeatureViewed: (feature: string) => {
    analytics.track('Premium Feature Viewed', { feature });
  }
};

// Premium conversion tracking
export const trackConversion = {
  subscriptionStarted: (plan: string, price: number) => {
    analytics.track('Subscription Started', { plan, price });
  },
  premiumFeatureUnlocked: (feature: string) => {
    analytics.track('Premium Feature Unlocked', { feature });
  }
};

// Retention tracking
export const trackRetention = {
  dailyStreak: (days: number) => {
    analytics.track('Daily Streak Updated', { days });
  },
  sessionCompleted: (duration: number) => {
    analytics.track('Session Completed', { duration });
  }
};
