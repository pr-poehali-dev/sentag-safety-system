import HowItWorksSection from '@/components/sections/HowItWorksSection';
import SystemBenefitsSection from '@/components/sections/SystemBenefitsSection';
import ComponentsSection from '@/components/sections/ComponentsSection';
import RequestFormSection from '@/components/sections/RequestFormSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactsSection from '@/components/sections/ContactsSection';
import DocumentsSection from '@/components/sections/DocumentsSection';

export default function ContentSections() {
  return (
    <>
      <HowItWorksSection />
      <SystemBenefitsSection />
      <ComponentsSection />
      <RequestFormSection />
      <AboutSection />
      <ContactsSection />
      <DocumentsSection />
    </>
  );
}