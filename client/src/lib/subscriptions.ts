export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    features: [
      'Basic verse access',
      'Mood-based recommendations',
      'Limited bookmarks (5)',
      'Basic translations'
    ],
    price: 0
  },
  PREMIUM: {
    name: 'Premium',
    features: [
      'Unlimited verse access',
      'Advanced mood analysis',
      'Unlimited bookmarks',
      'Multiple translations',
      'Verse commentaries',
      'Offline access',
      'Ad-free experience',
      'Daily personalized insights'
    ],
    price: 499, // ₹499/month
    yearlyPrice: 4999 // ₹4,999/year
  },
  GURU: {
    name: 'Guru',
    features: [
      'All Premium features',
      'Personal spiritual coach',
      'Weekly live sessions',
      'Exclusive community access',
      'Priority verse requests',
      'Custom mood patterns',
      'Family account (up to 5)',
      'Advanced analytics'
    ],
    price: 999, // ₹999/month
    yearlyPrice: 9999 // ₹9,999/year
  }
};

export const PREMIUM_FEATURES = {
  VERSE_COMMENTARY: 'verse_commentary',
  OFFLINE_ACCESS: 'offline_access',
  UNLIMITED_BOOKMARKS: 'unlimited_bookmarks',
  PERSONAL_COACH: 'personal_coach',
  LIVE_SESSIONS: 'live_sessions',
  FAMILY_ACCESS: 'family_access',
  ADVANCED_ANALYTICS: 'advanced_analytics'
};

// Free tier limits
export const FREE_TIER_LIMITS = {
  MAX_BOOKMARKS: 5,
  MAX_DAILY_VERSES: 10,
  MAX_TRANSLATIONS: 1
};
