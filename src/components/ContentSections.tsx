import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const HowItWorksSection = lazy(() => import('@/components/sections/HowItWorksSection'));
const SystemBenefitsSection = lazy(() => import('@/components/sections/SystemBenefitsSection'));
const ComponentsSection = lazy(() => import('@/components/sections/ComponentsSection'));
const RequestFormSection = lazy(() => import('@/components/sections/RequestFormSection'));
const AboutSection = lazy(() => import('@/components/sections/AboutSection'));
const ContactsSection = lazy(() => import('@/components/sections/ContactsSection'));
const DocumentsSection = lazy(() => import('@/components/sections/DocumentsSection'));

function LazySection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible && <Suspense fallback={<div className="py-16" />}>{children}</Suspense>}
    </div>
  );
}

interface ContentSectionsProps {
  scrollToSection?: (id: string) => void;
}

export default function ContentSections({ scrollToSection }: ContentSectionsProps) {
  const { settings } = useSiteSettings();
  const showDocuments = settings.showDocuments;

  return (
    <>
      <LazySection><HowItWorksSection /></LazySection>
      <LazySection><SystemBenefitsSection /></LazySection>
      <LazySection><ComponentsSection /></LazySection>
      <LazySection><RequestFormSection /></LazySection>
      <LazySection><AboutSection /></LazySection>
      <LazySection><ContactsSection scrollToSection={scrollToSection} /></LazySection>
      {showDocuments && <LazySection><DocumentsSection /></LazySection>}
    </>
  );
}
