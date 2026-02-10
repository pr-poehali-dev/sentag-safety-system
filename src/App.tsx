
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { trackEvent, TrackingEvent, EventCategory, initScrollTracking, initTimeTracking } from "@/utils/tracking";
import { trackVisit, updateActivity } from "@/utils/trackVisit";

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Редирект с www на основной домен
    if (window.location.hostname.startsWith('www.')) {
      const newUrl = window.location.href.replace('www.', '');
      window.location.replace(newUrl);
      return;
    }

    trackEvent(TrackingEvent.PAGE_VIEW, EventCategory.ENGAGEMENT);
    initScrollTracking();
    initTimeTracking();
    
    // Отслеживание первого посещения
    trackVisit();
    
    // Обновление активности каждые 2 минуты для онлайн-статистики
    updateActivity();
    const activityInterval = setInterval(() => {
      updateActivity();
    }, 2 * 60 * 1000); // 2 минуты

    const updateSeoAndFavicon = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/4c5eb463-eeb0-41c1-89da-753f8043246e');
        if (response.ok) {
          const data = await response.json();
          const settings = data.settings || {};
          
          const seoTitle = settings.seo_title || 'Безопасность вашего бассейна под контролем';
          const seoDescription = settings.seo_description || 'Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания.';
          const seoKeywords = settings.seo_keywords || 'СООУ, система безопасности бассейнов, Sentag AB';
          const faviconUrl = settings.favicon_url || 'https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/de3e8201-e38d-47fd-aeee-269c5979fdeb.jpg';
          const ogImageUrl = settings.og_image_url || 'https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/files/og-image-1770456083663.png';
          
          document.title = seoTitle;
          
          const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
          if (metaDescription) {
            metaDescription.content = seoDescription;
          }
          
          let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
          }
          metaKeywords.content = seoKeywords;
          
          const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
          if (ogTitle) {
            ogTitle.content = seoTitle;
          }
          
          const ogDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
          if (ogDescription) {
            ogDescription.content = seoDescription;
          }
          
          const twitterTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement;
          if (twitterTitle) {
            twitterTitle.content = seoTitle;
          }
          
          const twitterDescription = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement;
          if (twitterDescription) {
            twitterDescription.content = seoDescription;
          }
          
          let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
          if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.type = 'image/x-icon';
            document.head.appendChild(favicon);
          }
          favicon.href = faviconUrl;

          const ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
          if (ogImage) {
            ogImage.content = ogImageUrl;
          }

          const twitterImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement;
          if (twitterImage) {
            twitterImage.content = ogImageUrl;
          }
        }
      } catch (error) {
        console.error('Error loading SEO and favicon:', error);
      }
    };

    updateSeoAndFavicon();

    const handleFaviconChange = () => {
      updateSeoAndFavicon();
    };

    const handleSeoUpdate = () => {
      updateSeoAndFavicon();
    };

    window.addEventListener('faviconUpdate', handleFaviconChange);
    window.addEventListener('seoUpdate', handleSeoUpdate);

    return () => {
      clearInterval(activityInterval);
      window.removeEventListener('faviconUpdate', handleFaviconChange);
      window.removeEventListener('seoUpdate', handleSeoUpdate);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminPanel />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;