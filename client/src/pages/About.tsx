import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
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

export default function About() {
  const { t } = useLanguage();

  return (
    <PageLayout
      title={t('about.title')}
      subtitle={t('about.subtitle')}
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
              <h2 className="font-playfair text-2xl font-semibold mb-4">{t('about.mission.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.mission.desc')}
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
          <Card className="h-full transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold mb-4">{t('about.how.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.how.desc')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="md:col-span-2"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Card className="transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold mb-4">{t('about.text.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('about.text.desc')}
              </p>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <motion.div
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3"
                    alt="Sacred text background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        className="mt-12"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center bg-primary/5 rounded-lg p-8">
          <h2 className="font-playfair text-2xl font-semibold mb-4">{t('about.credits.title')}</h2>
          <p className="text-muted-foreground">
            {t('about.credits.desc')}
          </p>
        </div>
      </motion.div>
    </PageLayout>
  );
}