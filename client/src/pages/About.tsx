import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/PageLayout";
import { Quote } from "lucide-react";

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

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <PageLayout
        title="About GyanGita"
        subtitle="Your spiritual companion for discovering the timeless wisdom of Bhagavad Gita"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Story Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="prose prose-lg max-w-none dark:prose-invert"
          >
            <h2 className="font-playfair text-2xl md:text-3xl font-semibold mb-6 text-center text-foreground">
              The Story Behind GyanGita
            </h2>
            <div className="text-foreground/90 leading-relaxed">
              <p>
                In the bustling digital age where anxiety and uncertainty often cloud our minds, 
                I witnessed a close friend struggling to find clarity and peace. Her journey sparked 
                a realization: the timeless wisdom of Bhagavad Gita could be the beacon of light 
                for countless souls navigating modern life's complexities.
              </p>
              <p>
                What began as a simple desire to help a friend has evolved into a mission to bridge 
                ancient wisdom with contemporary challenges, making spiritual guidance accessible 
                in our moments of need.
              </p>
            </div>
          </motion.div>

          {/* Gandhi Quote */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4">
              <Quote className="h-8 w-8 text-primary" />
            </div>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <blockquote className="text-lg md:text-xl text-foreground/95 italic text-balance">
                  "When doubts haunt me, when disappointments stare me in the face, and I see not one ray 
                  of hope on the horizon, I turn to Bhagavad-Gita and find a verse to comfort me; and I 
                  immediately begin to smile in the midst of overwhelming sorrow."
                </blockquote>
                <footer className="mt-4 text-sm text-foreground/75">
                  — Mahatma Gandhi
                </footer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision & Mission */}
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="h-full transform hover:scale-105 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="font-playfair text-2xl font-semibold mb-4 text-foreground">Our Vision</h2>
                  <p className="text-foreground/90 leading-relaxed">
                    GyanGita envisions a world where ancient wisdom seamlessly integrates with modern life, 
                    providing solace and guidance to those seeking answers. We believe that the Gita's 
                    teachings aren't just philosophical concepts, but practical tools for emotional 
                    well-being and personal growth.
                  </p>
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
              <Card className="h-full transform hover:scale-105 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h2 className="font-playfair text-2xl font-semibold mb-4 text-foreground">Our Mission</h2>
                  <p className="text-foreground/90 leading-relaxed">
                    To make the profound wisdom of Bhagavad Gita accessible and relevant to everyone, 
                    helping them navigate life's challenges with clarity, purpose, and inner peace. 
                    We strive to be the bridge between timeless knowledge and contemporary needs.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Founder Section */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16"
          >
            <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative h-[400px] md:h-full">
                    <img 
                      src="/assets/rajat-udasi.jpg"
                      alt="Founder"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h2 className="font-playfair text-2xl font-semibold mb-4 text-foreground">Meet the Founder</h2>
                    <div className="space-y-4 text-foreground/90">
                      <p>
                        As an entrepreneur who started a digital marketing agency in 2018, I've always been 
                        fascinated by the intersection of technology and human experience. Through my work 
                        in marketing, advertising, and web development, I've observed how digital solutions 
                        can transform lives when aligned with meaningful purpose.
                      </p>
                      <p>
                        My journey in the digital world has taught me that while technology connects us, 
                        it's the wisdom of ages that truly guides us. This understanding, combined with 
                        a deep appreciation for the Bhagavad Gita's teachings, led to the creation of 
                        this platform.
                      </p>
                      <p>
                        I believe that in our fast-paced world, we need anchors of wisdom more than ever. 
                        GyanGita is my contribution to helping others find their path, just as the Gita's 
                        teachings have helped guide mine.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PageLayout>
    </div>
  );
}