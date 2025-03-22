import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  type?: string;
  imageUrl?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title = "Bhagavad Gita Wisdom",
  description = "Discover timeless wisdom from the Bhagavad Gita. Find verses that resonate with your emotional state and receive divine guidance for modern life challenges.",
  keywords = ["Bhagavad Gita", "Hindu scripture", "Krishna's teachings", "spiritual wisdom", "Vedic knowledge", "Sanskrit verses", "Hindu philosophy"],
  type = "website",
  imageUrl = "/og-image.jpg",
  canonicalUrl,
}: SEOProps) {
  const siteUrl = window.location.origin;
  const fullTitle = `${title} | Bhagavad Gita Wisdom`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={`${siteUrl}${imageUrl}`} />
      <meta property="og:url" content={canonicalUrl || window.location.href} />
      <meta property="og:site_name" content="Bhagavad Gita Wisdom" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${imageUrl}`} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
    </Helmet>
  );
}