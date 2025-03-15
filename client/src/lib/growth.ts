// Viral loops and sharing incentives
export const SHARING_REWARDS = {
  FIRST_SHARE: {
    reward: '7 days Premium access',
    code: 'SHARE7',
    conditions: 'First-time share on any platform'
  },
  VIRAL_SHARE: {
    reward: '1 month Premium access',
    code: 'VIRAL30',
    conditions: 'Share reaches 100+ clicks'
  },
  FAMILY_INVITE: {
    reward: '₹100 off monthly subscription',
    code: 'FAMILY100',
    conditions: 'New family member joins Premium'
  }
};

// Gamification elements
export const ACHIEVEMENTS = {
  DAILY_STREAK: {
    7: { badge: '🌱 Seeker', reward: '1 day Premium' },
    30: { badge: '🌿 Disciple', reward: '7 days Premium' },
    100: { badge: '🌳 Guru', reward: '1 month Premium' }
  },
  VERSE_MASTERY: {
    10: { badge: '📖 Chapter Guide', reward: 'Unlock commentary' },
    50: { badge: '📚 Verse Master', reward: 'Personal insights' },
    100: { badge: '🎓 Gita Scholar', reward: 'Guru consultation' }
  }
};

// Retention hooks
export const RETENTION_FEATURES = {
  DAILY_VERSE: {
    notificationTime: '07:00',
    personalization: true,
    shareButton: true
  },
  STREAK_PROTECTION: {
    maxProtection: 2,
    earnRate: '1 per month',
    premiumEarnRate: '2 per month'
  },
  COMMUNITY_CHALLENGES: {
    duration: '7 days',
    rewards: {
      participation: '3 days Premium',
      winner: '1 month Premium'
    }
  }
};

// Marketing campaigns
export const MARKETING_CAMPAIGNS = {
  NEW_USER: {
    welcomeOffer: '14 days Premium trial',
    initialDiscount: '20% off first 3 months'
  },
  SEASONAL: {
    diwali: {
      offer: '30% off annual subscription',
      duration: '7 days'
    },
    krishnaJanmashtami: {
      offer: '2 months free with annual plan',
      duration: '3 days'
    }
  },
  REFERRAL: {
    referrerReward: '₹200 off next renewal',
    refereeReward: '30 days Premium at ₹299'
  }
};

// Growth metrics tracking
export const trackGrowthMetrics = {
  acquisition: {
    channel: '',
    campaign: '',
    cost: 0,
    conversion: 0
  },
  engagement: {
    dau: 0,
    mau: 0,
    retentionRate: 0,
    churnRate: 0
  },
  revenue: {
    mrr: 0,
    arr: 0,
    ltv: 0,
    cac: 0
  }
};
