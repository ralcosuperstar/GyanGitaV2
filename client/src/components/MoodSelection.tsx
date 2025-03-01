import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VerseCard from "@/components/VerseCard";
import { useToast } from "@/components/ui/use-toast";

// Sample moods with associated icons and descriptions
const moods = [
  {
    id: "anxious",
    name: "Anxious",
    icon: "😟",
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    description: "Feeling worried or uneasy"
  },
  {
    id: "peaceful",
    name: "Peaceful",
    icon: "😌",
    color: "bg-blue-100 dark:bg-blue-900/30",
    description: "Feeling calm and centered"
  },
  {
    id: "confused",
    name: "Confused",
    icon: "😕",
    color: "bg-purple-100 dark:bg-purple-900/30",
    description: "Seeking clarity or direction"
  },
  {
    id: "motivated",
    name: "Motivated",
    icon: "💪",
    color: "bg-green-100 dark:bg-green-900/30",
    description: "Ready to take action"
  },
  {
    id: "sad",
    name: "Sad",
    icon: "😢",
    color: "bg-blue-100 dark:bg-blue-900/30",
    description: "Feeling down or sorrowful"
  },
  {
    id: "joyful",
    name: "Joyful",
    icon: "😄",
    color: "bg-orange-100 dark:bg-orange-900/30",
    description: "Experiencing happiness"
  },
  {
    id: "fearful",
    name: "Fearful",
    icon: "😨",
    color: "bg-red-100 dark:bg-red-900/30",
    description: "Confronting fears or worries"
  },
  {
    id: "grateful",
    name: "Grateful",
    icon: "🙏",
    color: "bg-green-100 dark:bg-green-900/30",
    description: "Feeling thankful"
  },
];

// Sample verses for each mood (in a real app, these would come from an API)
const moodVerses: Record<string, any[]> = {
  anxious: [
    {
      chapter: 2,
      verse: 14,
      slok: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
      transliteration: "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ āgamāpāyino 'nityās tāṁs titikṣasva bhārata",
      translation: "O son of Kunti, the nonpermanent appearance of happiness and distress, and their disappearance in due course, are like the appearance and disappearance of winter and summer seasons. They arise from sense perception, O scion of Bharata, and one must learn to tolerate them without being disturbed."
    },
    {
      chapter: 6,
      verse: 27,
      slok: "प्रशान्तमनसं ह्येनं योगिनं सुखमुत्तमम्। उपैति शान्तरजसं ब्रह्मभूतमकल्मषम्॥",
      transliteration: "praśānta-manasaṁ hy enaṁ yoginaṁ sukham uttamam upaiti śānta-rajasaṁ brahma-bhūtam akalmaṣam",
      translation: "The yogi whose mind is fixed on Me verily attains the highest happiness. By virtue of his identity with Brahman, he is liberated; his mind is peaceful, his passions are quieted, and he is freed from sin."
    }
  ],
  peaceful: [
    {
      chapter: 2,
      verse: 70,
      slok: "आपूर्यमाणमचलप्रतिष्ठं समुद्रमापः प्रविशन्ति यद्वत्। तद्वत्कामा यं प्रविशन्ति सर्वे स शान्तिमाप्नोति न कामकामी॥",
      transliteration: "āpūryamāṇam acala-pratiṣṭhaṁ samudram āpaḥ praviśanti yadvat tadvat kāmā yaṁ praviśanti sarve sa śāntim āpnoti na kāma-kāmī",
      translation: "A person who is not disturbed by the incessant flow of desires—that enter like rivers into the ocean, which is ever being filled but is always still—can alone achieve peace, and not the man who strives to satisfy such desires."
    }
  ],
  confused: [
    {
      chapter: 4,
      verse: 42,
      slok: "तस्मादज्ञानसम्भूतं हृत्स्थं ज्ञानासिनात्मनः। छित्त्वैनं संशयं योगमातिष्ठोत्तिष्ठ भारत॥",
      transliteration: "tasmād ajñāna-sambhūtaṁ hṛt-sthaṁ jñānāsinātmanaḥ chittvainaṁ saṁśayaṁ yogam ātiṣṭhottiṣṭha bhārata",
      translation: "Therefore the doubts which have arisen in your heart out of ignorance should be slashed by the weapon of knowledge. Armed with yoga, O Bharata, stand and fight."
    }
  ],
  motivated: [
    {
      chapter: 2,
      verse: 47,
      slok: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
      transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
      translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction."
    }
  ],
  sad: [
    {
      chapter: 2,
      verse: 22,
      slok: "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि। तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही॥",
      transliteration: "vāsāṁsi jīrṇāni yathā vihāya navāni gṛhṇāti naro 'parāṇi tathā śarīrāṇi vihāya jīrṇāny anyāni saṁyāti navāni dehī",
      translation: "As a person puts on new garments, giving up old ones, similarly, the soul accepts new material bodies, giving up the old and useless ones."
    }
  ],
  fearful: [
    {
      chapter: 2,
      verse: 40,
      slok: "नेहाभिक्रमनाशोऽस्ति प्रत्यवायो न विद्यते। स्वल्पमप्यस्य धर्मस्य त्रायते महतो भयात्॥",
      transliteration: "nehābhikrama-nāśo 'sti pratyavāyo na vidyate sv-alpam apy asya dharmasya trāyate mahato bhayāt",
      translation: "In this endeavor there is no loss or diminution, and a little advancement on this path can protect one from the most dangerous type of fear."
    }
  ],
  joyful: [
    {
      chapter: 5,
      verse: 21,
      slok: "बाह्यस्पर्शेष्वसक्तात्मा विन्दत्यात्मनि यत्सुखम्। स ब्रह्मयोगयुक्तात्मा सुखमक्षयमश्नुते॥",
      transliteration: "bāhya-sparśeṣv asaktātmā vindaty ātmani yat sukham sa brahma-yoga-yuktātmā sukham akṣayam aśnute",
      translation: "Such a liberated person is not attracted to material sense pleasure or external objects but is always in trance, enjoying the pleasure within. In this way the self-realized person enjoys unlimited happiness, for he concentrates on the Supreme."
    }
  ],
  grateful: [
    {
      chapter: 9,
      verse: 26,
      slok: "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति। तदहं भक्त्युपहृतमश्नामि प्रयतात्मनः॥",
      transliteration: "patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati tad ahaṁ bhakty-upahṛtam aśnāmi prayatātmanaḥ",
      translation: "If one offers Me with love and devotion a leaf, a flower, a fruit, or water, I will accept it."
    }
  ]
};

export function MoodSelection() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const { toast } = useToast();

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setIsLoading(true); // Set loading state to true
    setRecommendations([]); // Reset recommendations before fetching
    setTimeout(() => { // Simulate API call delay. Replace with actual API call in a real app.
      setRecommendations(moodVerses[moodId] || []);
      setIsLoading(false); // Set loading state to false after fetching
    }, 500);
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {moods.map((mood) => (
          <Button
            key={mood.id}
            variant="outline"
            className={`h-auto flex flex-col items-center p-4 hover:bg-primary/5 transition-colors ${
              selectedMood === mood.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleMoodSelect(mood.id)}
          >
            <span className="text-4xl mb-2">{mood.icon}</span>
            <span className="font-medium">{mood.name}</span>
            <span className="text-xs text-muted-foreground mt-1">{mood.description}</span>
          </Button>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedMood && moods.find(m => m.id === selectedMood)?.icon}{' '}
              Verses for {selectedMood && moods.find(m => m.id === selectedMood)?.name} Moments
            </DialogTitle>
            <DialogDescription>
              Here are verses from the Bhagavad Gita to guide you through this emotional state
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            {isLoading ? ( // Added loading indicator
              <Card>
                <CardContent className="py-8 text-center">
                  <p>Loading verses...</p>
                </CardContent>
              </Card>
            ) : recommendations.length > 0 ? (
              recommendations.map((verse, i) => (
                <VerseCard
                  key={i}
                  chapter={verse.chapter}
                  verse={verse.verse}
                  slok={verse.slok}
                  transliteration={verse.transliteration}
                  translation={verse.translation}
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No specific verses found for this mood. Try another mood or browse all chapters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Verse saved",
                  description: "This verse has been saved to your favorites.",
                });
              }}
            >
              Save to Favorites
            </Button>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}