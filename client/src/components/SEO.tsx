import { Helmet } from 'react-helmet-async';
import Analytics from './Analytics';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  type?: string;
  imageUrl?: string;
  canonicalUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export default function SEO({
  title = "Find Inner Peace Through Ancient Wisdom | Bhagavad Gita",
  description = "Discover personalized guidance from the Bhagavad Gita that resonates with your emotional state. Transform life's challenges into opportunities for growth with timeless wisdom.",
  keywords = [
    "Bhagavad Gita",
    "spiritual guidance",
    "emotional wisdom",
    "Krishna teachings",
    "mood based verses",
    "ancient wisdom",
    "Hindu scripture",
    "spiritual peace",
    "divine knowledge",
    "Sanskrit verses",
    "meditation",
    "mindfulness",
    "personal growth"
  ],
  type = "website",
  imageUrl = "/og-image.jpg",
  canonicalUrl,
  publishedTime = new Date().toISOString(),
  modifiedTime = new Date().toISOString(),
  author = "Bhagavad Gita Wisdom"
}: SEOProps) {
  const siteUrl = window.location.origin;
  const fullTitle = `${title} | Bhagavad Gita Wisdom`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={`${siteUrl}${imageUrl}`} />
      <meta property="og:url" content={canonicalUrl || window.location.href} />
      <meta property="og:site_name" content="Bhagavad Gita Wisdom" />
      <meta property="article:published_time" content={publishedTime} />
      <meta property="article:modified_time" content={modifiedTime} />
      <meta property="article:author" content={author} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${imageUrl}`} />
      <meta name="twitter:site" content="@BhagavadGitaWisdom" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#000000" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Bhagavad Gita Wisdom",
          "description": description,
          "url": siteUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Bhagavad Gita Wisdom",
            "logo": {
              "@type": "ImageObject",
              "url": `${siteUrl}/logo.png`
            }
          }
        })}
      </script>

      {/* Spiritual Content Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SpiritualOrReligiousOrganization",
          "name": "Bhagavad Gita Wisdom",
          "description": description,
          "url": siteUrl,
          "sameAs": [
            "https://en.wikipedia.org/wiki/Bhagavad_Gita"
          ],
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
          },
          "image": `${siteUrl}${imageUrl}`,
          "offers": {
            "@type": "Offer",
            "name": "Spiritual Wisdom",
            "description": "Access timeless wisdom from the Bhagavad Gita through an innovative mood-based verse recommendation system"
          }
        })}
      </script>

      {/* Google Analytics */}
      <Analytics />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
}