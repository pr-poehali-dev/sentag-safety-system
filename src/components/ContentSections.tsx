import { useState, useEffect } from 'react';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import SystemBenefitsSection from '@/components/sections/SystemBenefitsSection';
import ComponentsSection from '@/components/sections/ComponentsSection';
import RequestFormSection from '@/components/sections/RequestFormSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactsSection from '@/components/sections/ContactsSection';
import DocumentsSection from '@/components/sections/DocumentsSection';

export default function ContentSections() {
  const [showDocuments, setShowDocuments] = useState(true);

  useEffect(() => {
    const savedState = localStorage.getItem('show_documents_section');
    if (savedState !== null) {
      setShowDocuments(savedState === 'true');
    }
  }, []);

  return (
    <>
      <HowItWorksSection />
      <SystemBenefitsSection />
      <ComponentsSection />
      <RequestFormSection />
      <AboutSection />
      <ContactsSection />
      {showDocuments && <DocumentsSection />}
    </>
  );
}