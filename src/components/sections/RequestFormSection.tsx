import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import FormStep1 from './request-form/FormStep1';
import FormStep2 from './request-form/FormStep2';
import PrivacyPolicyModal from '@/components/PrivacyPolicyModal';
import { trackClick } from '@/utils/trackVisit';
import { trackEvent, TrackingEvent, EventCategory } from '@/utils/tracking';

export default function RequestFormSection() {
  const [formStep, setFormStep] = useState(1);
  const [showConsentText, setShowConsentText] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [requestId, setRequestId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [companyCardFile, setCompanyCardFile] = useState<File | null>(null);
  const [poolSchemeFiles, setPoolSchemeFiles] = useState<File[]>([]);
  const [companyCardLoaded, setCompanyCardLoaded] = useState(false);
  const [poolSchemesLoaded, setPoolSchemesLoaded] = useState<boolean[]>([]);
  const [step1StartTime, setStep1StartTime] = useState<string | null>(null);
  const [step2StartTime, setStep2StartTime] = useState<string | null>(null);

  useEffect(() => {
    setStep1StartTime(new Date().toISOString());
    trackEvent(TrackingEvent.START_FORM, EventCategory.FORM, {
      form_name: 'request_calculation',
    });
  }, []);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    company: '',
    role: '',
    fullName: '',
    objectName: '',
    objectAddress: '',
    consent: false,
    marketingConsent: false,
  });
  const [step2Data, setStep2Data] = useState({
    visitorsInfo: '',
    poolSize: '',
    deadline: ''
  });
  const [uploadProgress, setUploadProgress] = useState<string>('');

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
    
    trackClick('Перейти к шагу 2', 'request-form');
    setIsSubmitting(true);
    
    try {
      // Получаем visitor_id из localStorage, генерируем если нет
      let visitorId = localStorage.getItem('visitor_id');
      if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('visitor_id', visitorId);
      }
      
      const response = await fetch('https://functions.poehali.dev/1958e610-cb1f-4259-aafb-53cbe89451b6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          step: 1,
          step1StartTime: step1StartTime,
          visitorId: visitorId,
          ...formData
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setRequestId(result.requestId);
        setStep2StartTime(new Date().toISOString());
        trackEvent(TrackingEvent.COMPLETE_STEP_1, EventCategory.FORM, {
          form_name: 'request_calculation',
          request_id: result.requestId,
        });
        setFormStep(2);
      } else {
        alert('Ошибка при сохранении данных');
      }
    } catch (error) {
      alert(`Ошибка при сохранении данных: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    
    trackClick('Отправить заявку', 'request-form');
    setIsSubmitting(true);
    setUploadProgress('Начинаем загрузку файлов...');
    
    try {
      let companyCardUrl = null;
      const poolSchemeUrls: string[] = [];
      
      const totalFiles = (companyCardFile ? 1 : 0) + poolSchemeFiles.length;
      let uploadedCount = 0;
      
      if (companyCardFile) {
        setUploadProgress(`Загрузка карточки предприятия (${uploadedCount + 1}/${totalFiles})...`);
        companyCardUrl = await uploadFile(companyCardFile, 'company_card');
        uploadedCount++;
        setUploadProgress(`Карточка предприятия загружена (${uploadedCount}/${totalFiles})`);
      }
      
      for (let i = 0; i < poolSchemeFiles.length; i++) {
        setUploadProgress(`Загрузка схемы бассейна ${i + 1} (${uploadedCount + 1}/${totalFiles})...`);
        const url = await uploadFile(poolSchemeFiles[i], 'pool_scheme');
        poolSchemeUrls.push(url);
        uploadedCount++;
        setUploadProgress(`Схема бассейна ${i + 1} загружена (${uploadedCount}/${totalFiles})`);
      }
      
      setUploadProgress('Все файлы загружены! Сохранение заявки...');
      
      const response = await fetch('https://functions.poehali.dev/1958e610-cb1f-4259-aafb-53cbe89451b6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          step: 2,
          requestId,
          step2StartTime: step2StartTime,
          ...step2Data,
          companyCardUrl,
          poolSchemeUrls
        })
      });
      
      console.log('Response status:', response.status);
      
      const result = await response.json();
      
      if (!response.ok) {
        alert(`Ошибка сервера: ${result.error || 'Неизвестная ошибка'}`);
        return;
      }
      
      if (result.success) {
        setUploadProgress('Заявка успешно отправлена!');
        trackEvent(TrackingEvent.COMPLETE_STEP_2, EventCategory.FORM, {
          form_name: 'request_calculation',
          request_id: requestId,
        });
        trackEvent(TrackingEvent.SUBMIT_FORM, EventCategory.CONVERSION, {
          form_name: 'request_calculation',
          request_id: requestId,
        });
        trackEvent(TrackingEvent.LEAD, EventCategory.CONVERSION, {
          form_name: 'request_calculation',
          request_id: requestId,
          lead_type: 'request_calculation',
        });
        setTimeout(() => {
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
            marketingConsent: false,
          });
          setStep2Data({
            visitorsInfo: '',
            poolSize: '',
            deadline: ''
          });
          setRequestId(null);
          setCompanyCardFile(null);
          setPoolSchemeFiles([]);
          setUploadProgress('');
        }, 1000);
      } else {
        setUploadProgress('');
        alert(`Ошибка при отправке заявки: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      setUploadProgress('');
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

  const handleSetCompanyCardFile = (file: File | null) => {
    setCompanyCardFile(file);
    setCompanyCardLoaded(!!file);
  };

  const handleSetPoolSchemeFiles = (files: File[]) => {
    setPoolSchemeFiles(files);
    setPoolSchemesLoaded(files.map(() => true));
  };

  const canSubmitStep2 = () => {
    if (isSubmitting || isUploadingFiles) return false;
    
    if (companyCardFile && !companyCardLoaded) return false;
    
    for (let i = 0; i < poolSchemeFiles.length; i++) {
      if (!poolSchemesLoaded[i]) return false;
    }
    
    return true;
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
                uploadProgress={uploadProgress}
                canSubmit={canSubmitStep2()}
                onStep2DataChange={handleStep2DataChange}
                onSetCompanyCardFile={handleSetCompanyCardFile}
                onSetPoolSchemeFiles={handleSetPoolSchemeFiles}
                onSubmitStep2={handleSubmitStep2}
                onBackStep={() => setFormStep(1)}
              />
            )}
          </Card>
          
          <p className="text-center text-sm text-slate-500 mt-6">
            <button 
              onClick={() => { trackClick('Политика конфиденциальности', 'request-form'); setShowPrivacyPolicy(true); }}
              className="underline hover:text-primary transition"
            >
              Политика конфиденциальности
            </button>
          </p>
        </div>
      </div>
      
      <PrivacyPolicyModal open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy} />
    </section>
  );
}