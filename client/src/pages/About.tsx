import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-playfair text-4xl font-bold md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              About GyanGita
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your spiritual companion for discovering the timeless wisdom of Bhagavad Gita
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Card className="transform hover:scale-105 transition-all">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                GyanGita aims to make the profound wisdom of Bhagavad Gita accessible and relevant 
                to modern life. We understand that different emotional states call for different 
                spiritual guidance, which is why we've created this unique mood-based approach to 
                exploring the sacred text.
              </p>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-all">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold mb-4">How It Works</h2>
              <p className="text-muted-foreground leading-relaxed">
                Simply select your current mood, and GyanGita will present you with carefully 
                chosen verses from the Bhagavad Gita that address your emotional state. Each verse 
                comes with both Sanskrit text and English translation to ensure complete understanding.
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 transform hover:scale-105 transition-all">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold mb-4">The Sacred Text</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The Bhagavad Gita, often referred to as the Gita, is a 700-verse Sanskrit scripture 
                that is part of the epic Mahabharata. It contains a conversation between Prince Arjuna 
                and Lord Krishna, who serves as his charioteer. Through this dialogue, the text presents 
                a comprehensive worldview and path to spiritual liberation.
              </p>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3"
                  alt="Sacred text background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center bg-primary/5 rounded-lg p-8">
          <h2 className="font-playfair text-2xl font-semibold mb-4">API Credits</h2>
          <p className="text-muted-foreground">
            We are grateful to{" "}
            <a 
              href="https://github.com/vedicscriptures"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pt. Prashant Tripathi and their team
            </a>{" "}
            for providing the comprehensive Bhagavad Gita API that powers this application.
          </p>
        </div>
      </div>
    </div>
  );
}