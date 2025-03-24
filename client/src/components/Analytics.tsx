import { useEffect } from 'react';
import { useLocation } from 'wouter';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-2T82F3C9QM";
    document.head.appendChild(script);

    // Initialize gtag
    gtag('js', new Date());
    gtag('config', 'G-2T82F3C9QM');

    // Track page views
    gtag('event', 'page_view', {
      page_path: location,
    });

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Track route changes
  useEffect(() => {
    window.gtag?.('event', 'page_view', {
      page_path: location,
    });
  }, [location]);

  return null;
}