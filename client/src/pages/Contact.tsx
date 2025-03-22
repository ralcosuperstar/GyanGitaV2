import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MessageSquare } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

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
    <PageLayout
      title="Contact Us"
      subtitle="Have questions or feedback? We'd love to hear from you."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card className="h-full transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <motion.div 
                  className="flex items-center gap-4 group"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <a 
                    href="mailto:support@gyangita.com"
                    className="text-lg hover:text-primary transition-colors"
                  >
                    support@gyangita.com
                  </a>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-4 group"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <a 
                    href="tel:+919370922063"
                    className="text-lg hover:text-primary transition-colors"
                  >
                    +91 9370922063
                  </a>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-4 group"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg text-muted-foreground">
                    Response within 24 hours
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                variants={formVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={inputVariants}>
                  <label className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input 
                    placeholder="Your name"
                    required 
                    className="h-12 transition-all focus:scale-[1.02]"
                  />
                </motion.div>

                <motion.div variants={inputVariants}>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input 
                    type="email" 
                    placeholder="Your email"
                    required 
                    className="h-12 transition-all focus:scale-[1.02]"
                  />
                </motion.div>

                <motion.div variants={inputVariants}>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Your message"
                    className="min-h-[150px] resize-none transition-all focus:scale-[1.02]"
                    required
                  />
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-12 transition-transform"
                  >
                    Send Message
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageLayout>
  );
}