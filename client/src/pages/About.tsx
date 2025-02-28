import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-playfair text-4xl font-bold md:text-5xl">
          About GyanGita
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your spiritual companion for discovering the timeless wisdom of Bhagavad Gita
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-playfair text-2xl font-semibold">Our Mission</h2>
            <p className="mt-4">
              GyanGita aims to make the profound wisdom of Bhagavad Gita accessible and relevant 
              to modern life. We understand that different emotional states call for different 
              spiritual guidance, which is why we've created this unique mood-based approach to 
              exploring the sacred text.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-playfair text-2xl font-semibold">How It Works</h2>
            <p className="mt-4">
              Simply select your current mood, and GyanGita will present you with carefully 
              chosen verses from the Bhagavad Gita that address your emotional state. Each verse 
              comes with both Sanskrit text and English translation to ensure complete understanding.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h2 className="font-playfair text-2xl font-semibold">The Sacred Text</h2>
            <p className="mt-4">
              The Bhagavad Gita, often referred to as the Gita, is a 700-verse Sanskrit scripture 
              that is part of the epic Mahabharata. It contains a conversation between Prince Arjuna 
              and Lord Krishna, who serves as his charioteer. Through this dialogue, the text presents 
              a comprehensive worldview and path to spiritual liberation.
            </p>
            <div className="mt-6">
              <img 
                src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3"
                alt="Sacred text background"
                className="mx-auto rounded-lg object-cover"
                style={{ maxHeight: "300px", width: "100%" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="font-playfair text-2xl font-semibold">API Credits</h2>
        <p className="mt-4">
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
  );
}
