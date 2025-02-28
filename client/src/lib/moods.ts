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
    description: "Verses to help control and overcome anger",
    icon: "😠"
  },
  {
    id: "peaceful",
    label: "Seeking Peace",
    description: "Verses for finding inner peace and tranquility",
    icon: "😌"
  },
  {
    id: "depression",
    label: "Depression",
    description: "Verses offering solace and hope during difficult times",
    icon: "😞"
  },
  {
    id: "confusion",
    label: "Confusion",
    description: "Verses providing clarity and direction",
    icon: "😕"
  },
  {
    id: "fear",
    label: "Fear",
    description: "Verses for overcoming fear and anxiety",
    icon: "😨"
  },
  {
    id: "greed",
    label: "Greed",
    description: "Verses about overcoming material attachment",
    icon: "🤑"
  },
  {
    id: "demotivated",
    label: "Demotivated",
    description: "Verses for inspiration and motivation",
    icon: "😩"
  },
  {
    id: "temptation",
    label: "Temptation",
    description: "Verses about controlling senses and desires",
    icon: "😈"
  },
  {
    id: "forgetfulness",
    label: "Forgetfulness",
    description: "Verses about mindfulness and remembrance",
    icon: "🤔"
  },
  {
    id: "losing_hope",
    label: "Losing Hope",
    description: "Verses offering encouragement and assurance",
    icon: "😔"
  },
  {
    id: "lust",
    label: "Lust",
    description: "Verses about transcending physical desires",
    icon: "💖"
  },
  {
    id: "uncontrolled_mind",
    label: "Uncontrolled Mind",
    description: "Verses about mental discipline and control",
    icon: "🧠"
  },
  {
    id: "envy",
    label: "Dealing with Envy",
    description: "Verses about overcoming jealousy",
    icon: "😤"
  },
  {
    id: "discriminated",
    label: "Discriminated",
    description: "Verses about equality and universal vision",
    icon: "🤝"
  },
  {
    id: "forgiveness",
    label: "Practicing Forgiveness",
    description: "Verses about forgiveness and compassion",
    icon: "🙏"
  }
];