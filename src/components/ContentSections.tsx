import { useState, useEffect } from 'react';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import SystemBenefitsSection from '@/components/sections/SystemBenefitsSection';
import ComponentsSection from '@/components/sections/ComponentsSection';
import RequestFormSection from '@/components/sections/RequestFormSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactsSection from '@/components/sections/ContactsSection';
import DocumentsSection from '@/components/sections/DocumentsSection';

interface ContentSectionsProps {
  scrollToSection?: (id: string) => void;
}

export default function ContentSections({ scrollToSection }: ContentSectionsProps) {
  const [showDocuments, setShowDocuments] = useState(true);

  useEffect(() => {
    const updateShowDocuments = () => {
      const savedState = localStorage.getItem('show_documents_section');
      if (savedState !== null) {
        setShowDocuments(savedState === 'true');
      }
    };

    updateShowDocuments();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'show_documents_section') {
        updateShowDocuments();
      }
    };

    const handleCustomEvent = () => {
      updateShowDocuments();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('documentsToggle', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('documentsToggle', handleCustomEvent);
    };
  }, []);

  return (
    <>
      <HowItWorksSection />
      <SystemBenefitsSection />
      <ComponentsSection />
      <RequestFormSection />
      <AboutSection />
      <ContactsSection scrollToSection={scrollToSection} />
      {showDocuments && <DocumentsSection />}
    </>
  );
}