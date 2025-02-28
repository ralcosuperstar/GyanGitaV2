import { Card, CardContent } from "@/components/ui/card";
import { moods } from "@/lib/moods";

interface MoodSelectorProps {
  onSelect: (moodId: string) => void;
}

export default function MoodSelector({ onSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {moods.map((mood) => (
        <Card
          key={mood.id}
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => onSelect(mood.id)}
        >
          <CardContent className="p-6">
            <div className="mb-4 h-32 overflow-hidden rounded-lg">
              <img
                src={mood.icon}
                alt={mood.label}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mb-2 font-playfair text-lg font-semibold">{mood.label}</h3>
            <p className="text-sm text-muted-foreground">{mood.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
