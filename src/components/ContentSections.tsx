import { useState } from 'react';
import SystemBenefitsSection from './sections/SystemBenefitsSection';
import SystemComponentsSection from './sections/SystemComponentsSection';
import AboutDocumentsSection from './sections/AboutDocumentsSection';
import ContactFormSection from './sections/ContactFormSection';

export default function ContentSections() {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    company: '',
    role: '',
    fullName: '',
    objectName: '',
    objectAddress: '',
    consent: false,
  });
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleComponent = (id: string) => {
    setExpandedComponent(expandedComponent === id ? null : id);
  };

  return (
    <>
      <SystemBenefitsSection />
      
      <SystemComponentsSection 
        expandedComponent={expandedComponent}
        toggleComponent={toggleComponent}
      />
      
      <AboutDocumentsSection />
      
      <ContactFormSection 
        formStep={formStep}
        formData={formData}
        setFormStep={setFormStep}
        handleFormChange={handleFormChange}
      />
    </>
  );
}
