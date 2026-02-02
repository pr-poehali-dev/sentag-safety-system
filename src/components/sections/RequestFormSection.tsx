import { useState } from 'react';
import { Card } from '@/components/ui/card';
import FormStep1 from './request-form/FormStep1';
import FormStep2 from './request-form/FormStep2';
import PrivacyPolicyDialog from './request-form/PrivacyPolicyDialog';

export default function RequestFormSection() {
  const [formStep, setFormStep] = useState(1);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [showConsentText, setShowConsentText] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [requestId, setRequestId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyCardFile, setCompanyCardFile] = useState<File | null>(null);
  const [poolSchemeFiles, setPoolSchemeFiles] = useState<File[]>([]);
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
  const [step2Data, setStep2Data] = useState({
    visitorsInfo: '',
    poolSize: '',
    deadline: ''
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: false });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.phone.trim()) newErrors.phone = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.company.trim()) newErrors.company = true;
    if (!formData.role.trim()) newErrors.role = true;
    if (!formData.fullName.trim()) newErrors.fullName = true;
    if (!formData.objectName.trim()) newErrors.objectName = true;
    if (!formData.objectAddress.trim()) newErrors.objectAddress = true;
    if (!formData.consent) newErrors.consent = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (!validateStep1()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/1958e610-cb1f-4259-aafb-53cbe89451b6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          step: 1,
          ...formData
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setRequestId(result.requestId);
        setFormStep(2);
      } else {
        alert('Ошибка при сохранении данных');
      }
    } catch (error) {
      console.error('Error saving step 1:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
    });
  };

  const uploadFile = async (file: File, category: string): Promise<string> => {
    const content = await fileToBase64(file);
    
    const response = await fetch('https://functions.poehali.dev/55e8594b-4257-4cbf-a5c4-ef2f2a03342b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: file.name,
        type: file.type,
        content: content,
        requestId,
        category
      })
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Ошибка загрузки файла');
    }
    
    return result.url;
  };

  const handleSubmitStep2 = async () => {
    if (!requestId) {
      alert('Ошибка: ID заявки не найден');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let companyCardUrl = null;
      const poolSchemeUrls: string[] = [];
      
      if (companyCardFile) {
        console.log('Загрузка карточки предприятия...');
        companyCardUrl = await uploadFile(companyCardFile, 'company_card');
        console.log('Карточка загружена:', companyCardUrl);
      }
      
      for (let i = 0; i < poolSchemeFiles.length; i++) {
        console.log(`Загрузка схемы бассейна ${i + 1}/${poolSchemeFiles.length}...`);
        const url = await uploadFile(poolSchemeFiles[i], 'pool_scheme');
        poolSchemeUrls.push(url);
        console.log(`Схема ${i + 1} загружена:`, url);
      }
      
      console.log('Все файлы загружены, отправка данных формы...');
      
      const response = await fetch('https://functions.poehali.dev/1958e610-cb1f-4259-aafb-53cbe89451b6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          step: 2,
          requestId,
          ...step2Data,
          companyCardUrl,
          poolSchemeUrls
        })
      });
      
      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('Response body:', result);
      
      if (!response.ok) {
        console.error('Server error:', result);
        alert(`Ошибка сервера: ${result.error || 'Неизвестная ошибка'}`);
        return;
      }
      
      if (result.success) {
        alert('Заявка успешно отправлена!');
        setFormStep(1);
        setFormData({
          phone: '',
          email: '',
          company: '',
          role: '',
          fullName: '',
          objectName: '',
          objectAddress: '',
          consent: false,
        });
        setStep2Data({
          visitorsInfo: '',
          poolSize: '',
          deadline: ''
        });
        setRequestId(null);
        setCompanyCardFile(null);
        setPoolSchemeFiles([]);
      } else {
        alert(`Ошибка при отправке заявки: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Error saving step 2:', error);
      if (error instanceof Error) {
        alert(`Ошибка при отправке заявки: ${error.message}`);
      } else {
        alert('Ошибка при отправке заявки');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2DataChange = (field: string, value: string) => {
    setStep2Data({ ...step2Data, [field]: value });
  };

  return (
    <section id="request" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-800">
            Запросить расчет
          </h2>
          <p className="text-center text-slate-600 mb-12">Заполните форму, и наш специалист свяжется с вами</p>
          
          <Card className="p-8">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${formStep >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                  1
                </div>
                <div className={`h-1 w-20 ${formStep >= 2 ? 'bg-primary' : 'bg-slate-200'}`} />
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${formStep >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                  2
                </div>
              </div>
            </div>

            {formStep === 1 && (
              <FormStep1
                formData={formData}
                errors={errors}
                showConsentText={showConsentText}
                isSubmitting={isSubmitting}
                onFormChange={handleFormChange}
                onSetShowConsentText={setShowConsentText}
                onNextStep={handleNextStep}
              />
            )}

            {formStep === 2 && (
              <FormStep2
                step2Data={step2Data}
                companyCardFile={companyCardFile}
                poolSchemeFiles={poolSchemeFiles}
                isSubmitting={isSubmitting}
                onStep2DataChange={handleStep2DataChange}
                onSetCompanyCardFile={setCompanyCardFile}
                onSetPoolSchemeFiles={setPoolSchemeFiles}
                onSubmitStep2={handleSubmitStep2}
                onBackStep={() => setFormStep(1)}
              />
            )}
          </Card>

          <p className="text-center text-sm text-slate-500 mt-6">
            <PrivacyPolicyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
          </p>
        </div>
      </div>
    </section>
  );
}