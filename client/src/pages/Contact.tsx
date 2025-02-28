import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <div className="container px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-playfair text-4xl font-bold md:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-playfair text-2xl font-semibold">Get in Touch</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <a 
                  href="mailto:support@gyangita.com"
                  className="hover:text-primary"
                >
                  support@gyangita.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <a 
                  href="tel:+919370922063"
                  className="hover:text-primary"
                >
                  +91 9370922063
                </a>
              </div>
            </div>

            <div className="mt-8">
              <img
                src="https://images.unsplash.com/photo-1476900164809-ff19b8ae5968"
                alt="Contact decoration"
                className="rounded-lg object-cover"
                style={{ maxHeight: "200px", width: "100%" }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Name
                </label>
                <Input placeholder="Your name" required />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <Input type="email" placeholder="your@email.com" required />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Message
                </label>
                <Textarea 
                  placeholder="Your message..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
