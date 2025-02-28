export interface Mood {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const moods: Mood[] = [
  {
    id: "peaceful",
    label: "Peaceful",
    description: "Find inner peace and tranquility",
    icon: "https://images.unsplash.com/photo-1531643439684-b25b6c766747"
  },
  {
    id: "anxious",
    label: "Anxious",
    description: "Calm your mind and reduce anxiety",
    icon: "https://images.unsplash.com/photo-1455849318743-b2233052fcff"
  },
  {
    id: "confused",
    label: "Confused",
    description: "Seek clarity and guidance",
    icon: "https://images.unsplash.com/photo-1507120410856-1f35574c3b45"
  },
  {
    id: "motivated",
    label: "Motivated",
    description: "Boost your spiritual energy",
    icon: "https://images.unsplash.com/photo-1617440168937-c6497eaa8db5"
  },
  {
    id: "grateful",
    label: "Grateful",
    description: "Express gratitude and appreciation",
    icon: "https://images.unsplash.com/photo-1496449903678-68ddcb189a24"
  },
  {
    id: "sad",
    label: "Sad",
    description: "Find comfort in divine wisdom",
    icon: "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7"
  },
  {
    id: "happy",
    label: "Happy",
    description: "Celebrate with spiritual joy",
    icon: "https://images.unsplash.com/photo-1504548840739-580b10ae7715"
  },
  {
    id: "seeking",
    label: "Seeking",
    description: "Discover deeper meaning",
    icon: "https://images.unsplash.com/photo-1499728603263-13726abce5fd"
  }
];
