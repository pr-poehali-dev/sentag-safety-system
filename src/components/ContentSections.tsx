import HowItWorksSection from '@/components/sections/HowItWorksSection';
import SystemBenefitsSection from '@/components/sections/SystemBenefitsSection';
import ComponentsSection from '@/components/sections/ComponentsSection';
import RequestFormSection from '@/components/sections/RequestFormSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactsSection from '@/components/sections/ContactsSection';
import DocumentsSection from '@/components/sections/DocumentsSection';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface ContentSectionsProps {
  scrollToSection?: (id: string) => void;
}

export default function ContentSections({ scrollToSection }: ContentSectionsProps) {
  const { settings } = useSiteSettings();
  const showDocuments = settings.showDocuments;

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