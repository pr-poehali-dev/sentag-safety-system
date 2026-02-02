import HowItWorksSection from '@/components/sections/HowItWorksSection';
import SystemBenefitsSection from '@/components/sections/SystemBenefitsSection';
import ComponentsSection from '@/components/sections/ComponentsSection';
import RequestFormSection from '@/components/sections/RequestFormSection';
import AboutDocumentsSection from '@/components/sections/AboutDocumentsSection';
import ContactsSection from '@/components/sections/ContactsSection';

export default function ContentSections() {
  return (
    <>
      <HowItWorksSection />
      <SystemBenefitsSection />
      <ComponentsSection />
      <RequestFormSection />
      <AboutDocumentsSection />
      <ContactsSection />
    </>
  );
}
