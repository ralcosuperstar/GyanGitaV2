import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function Contact() {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-playfair text-4xl font-bold md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {t('contact.title')}
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Card className="transform hover:scale-105 transition-all">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold mb-6">{t('contact.get_in_touch')}</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <a 
                    href="mailto:support@gyangita.com"
                    className="text-lg hover:text-primary transition-colors"
                  >
                    support@gyangita.com
                  </a>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <a 
                    href="tel:+919370922063"
                    className="text-lg hover:text-primary transition-colors"
                  >
                    +91 9370922063
                  </a>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {t('contact.response_time')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-all">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.form.name')}
                  </label>
                  <Input 
                    placeholder={t('contact.form.name')}
                    required 
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.form.email')}
                  </label>
                  <Input 
                    type="email" 
                    placeholder={t('contact.form.email')}
                    required 
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.form.message')}
                  </label>
                  <Textarea 
                    placeholder={t('contact.form.message')}
                    className="min-h-[150px] resize-none"
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full h-12">
                  {t('contact.form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}