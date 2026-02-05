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
    // Загружаем настройки с сервера
    const loadSettings = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/4c5eb463-eeb0-41c1-89da-753f8043246e');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings) {
            const showDocs = data.settings.show_documents_section ?? true;
            setShowDocuments(showDocs);
          }
        }
      } catch (error) {
        console.error('Error loading site settings:', error);
        // Если не удалось загрузить с сервера, используем localStorage
        const savedState = localStorage.getItem('show_documents_section');
        if (savedState !== null) {
          setShowDocuments(savedState === 'true');
        }
      }
    };

    loadSettings();

    const handleCustomEvent = () => {
      loadSettings();
    };

    window.addEventListener('documentsToggle', handleCustomEvent);

    return () => {
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