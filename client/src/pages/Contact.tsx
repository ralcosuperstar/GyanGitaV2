import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, AlertCircle } from "lucide-react";
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

export default function Contact() {
  return (
    <PageLayout
      title="Contact Us"
      subtitle="Get in touch with us for any questions or concerns"
    >
      <div className="max-w-3xl mx-auto">
        {/* Contact Information */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="transform hover:scale-105 transition-all duration-300">
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
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Disclaimer */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-muted/30 rounded-lg border border-primary/10 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 mt-1">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Content Disclaimer</h3>
              <p className="text-muted-foreground leading-relaxed">
                While we strive to maintain accuracy in our Bhagavad Gita content, translations, and interpretations, 
                we acknowledge that errors or inconsistencies may occur. We are not directly responsible for any 
                misinterpretations but are committed to improving the content quality.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We welcome feedback and corrections from our users. If you find any discrepancies or have suggestions 
                for improvement, please contact us using the information above. Your input helps us make this platform 
                more accurate and valuable for everyone.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}