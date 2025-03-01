
import { Helmet } from 'react-helmet-async';

interface MetaHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export default function MetaHead({
  title = "GyanGita - Spiritual Guidance from Bhagavad Gita",
  description = "Find spiritual guidance and wisdom from the Bhagavad Gita based on your current mood. Discover verses that speak to your emotional state and provide divine wisdom.",
  keywords = "Bhagavad Gita, spiritual guidance, mood-based wisdom, Hindu scripture, spiritual companion",
  ogImage = "/images/og-image.jpg",
  canonicalUrl
}: MetaHeadProps) {
  // Construct the base URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullOgImageUrl = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;
  const fullCanonicalUrl = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`) : undefined;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />
      
      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
    </Helmet>
  );
}
