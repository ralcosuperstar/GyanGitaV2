export interface Mood {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const moods: Mood[] = [
  {
    id: "anger",
    label: "Anger",
    description: "Find peace and control through divine wisdom",
    icon: "😠"
  },
  {
    id: "peaceful",
    label: "Seeking Peace",
    description: "Discover inner tranquility and calmness",
    icon: "😌"
  },
  {
    id: "depression",
    label: "Depression",
    description: "Find solace and hope in spiritual wisdom",
    icon: "😞"
  },
  {
    id: "confusion",
    label: "Confusion",
    description: "Gain clarity and direction through divine guidance",
    icon: "😕"
  },
  {
    id: "fear",
    label: "Fear",
    description: "Overcome anxiety with spiritual strength",
    icon: "😨"
  },
  {
    id: "greed",
    label: "Greed",
    description: "Learn to transcend material attachments",
    icon: "🤑"
  },
  {
    id: "demotivated",
    label: "Demotivated",
    description: "Find inspiration in sacred wisdom",
    icon: "😩"
  },
  {
    id: "temptation",
    label: "Temptation",
    description: "Master your senses and desires",
    icon: "😈"
  }
];