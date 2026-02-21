
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
import TelegramButton from "@/components/TelegramButton";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { trackEvent, TrackingEvent, EventCategory, initScrollTracking, initTimeTracking } from "@/utils/tracking";
import { trackVisit } from "@/utils/trackVisit";

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    if (window.location.hostname.startsWith('www.')) {
      const newUrl = window.location.href.replace('www.', '');
      window.location.replace(newUrl);
      return;
    }

    trackEvent(TrackingEvent.PAGE_VIEW, EventCategory.ENGAGEMENT);
    initScrollTracking();
    initTimeTracking();
    trackVisit();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <TelegramButton />
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
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
};

export default App;