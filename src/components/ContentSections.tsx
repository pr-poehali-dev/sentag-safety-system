import InfoSections from '@/components/sections/InfoSections';
import ComponentsSection from '@/components/sections/ComponentsSection';
import RequestFormSection from '@/components/sections/RequestFormSection';
import ContactsSection from '@/components/sections/ContactsSection';

export default function ContentSections() {
  return (
    <>
      <InfoSections />
      <ComponentsSection />
      <RequestFormSection />
      <ContactsSection />
    </>
  );
}
