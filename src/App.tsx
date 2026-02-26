
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense, Component, ReactNode } from "react";
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
import TelegramButton from "@/components/TelegramButton";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";
import { trackEvent, TrackingEvent, EventCategory, initScrollTracking, initTimeTracking } from "@/utils/tracking";
import { trackVisit } from "@/utils/trackVisit";

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Что-то пошло не так</h1>
          <p className="text-slate-600 mb-6">Попробуйте обновить страницу</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Обновить
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;