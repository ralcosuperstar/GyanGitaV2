import { Card, CardContent } from "@/components/ui/card";
import { moods } from "@/lib/moods";

interface MoodSelectorProps {
  onSelect: (moodId: string) => void;
  selectedMood: string | null;
}

export default function MoodSelector({ onSelect, selectedMood }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {moods.map((mood) => (
        <Card
          key={mood.id}
          className={`cursor-pointer transition-transform hover:scale-105 ${
            selectedMood === mood.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelect(mood.id)}
        >
          <CardContent className="p-4 text-center">
            <span className="block text-4xl mb-2">{mood.icon}</span>
            <h3 className="font-semibold mb-1">{mood.label}</h3>
            <p className="text-sm text-muted-foreground">{mood.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}