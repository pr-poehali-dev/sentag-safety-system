import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface SiteSettingsSectionProps {
  showDocuments: boolean;
  onToggleDocuments: () => void;
}

export default function SiteSettingsSection({ 
  showDocuments, 
  onToggleDocuments 
}: SiteSettingsSectionProps) {
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isEditingSeo, setIsEditingSeo] = useState(false);

  useEffect(() => {
    const savedTitle = localStorage.getItem('seo_title') || 'Безопасность вашего бассейна под контролем';
    const savedDescription = localStorage.getItem('seo_description') || 'Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания. Ее внедрение будет актуально в бассейнах, аквапарках и на других объектах, где есть закрытая вода.';
    setSeoTitle(savedTitle);
    setSeoDescription(savedDescription);
    
    updateMetaTags(savedTitle, savedDescription);
  }, []);

  const updateMetaTags = (title: string, description: string) => {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
  };

  const handleSaveSeo = () => {
    localStorage.setItem('seo_title', seoTitle);
    localStorage.setItem('seo_description', seoDescription);
    updateMetaTags(seoTitle, seoDescription);
    setIsEditingSeo(false);
    alert('SEO настройки сохранены');
  };

  const handleCancelSeo = () => {
    const savedTitle = localStorage.getItem('seo_title') || 'Безопасность вашего бассейна под контролем';
    const savedDescription = localStorage.getItem('seo_description') || 'Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания. Ее внедрение будет актуально в бассейнах, аквапарках и на других объектах, где есть закрытая вода.';
    setSeoTitle(savedTitle);
    setSeoDescription(savedDescription);
    setIsEditingSeo(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Управление сайтом</h2>
          <p className="text-slate-600">Настройки SEO и секций сайта</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-4 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="Search" className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">SEO Сниппет</p>
                <p className="text-sm text-slate-500">Заголовок и описание в поисковиках</p>
              </div>
            </div>
            {!isEditingSeo && (
              <Button variant="outline" onClick={() => setIsEditingSeo(true)}>
                <Icon name="Edit" className="mr-2" size={16} />
                Редактировать
              </Button>
            )}
          </div>

          {isEditingSeo ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">Заголовок страницы (Title)</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Безопасность вашего бассейна под контролем"
                  className="mt-2"
                  maxLength={100}
                />
                <p className="text-xs text-slate-500 mt-1">{seoTitle.length}/100 символов</p>
              </div>

              <div>
                <Label htmlFor="seoDescription">Описание (Description)</Label>
                <Textarea
                  id="seoDescription"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Передовые системы защиты для посетителей бассейнов..."
                  className="mt-2"
                  rows={3}
                  maxLength={300}
                />
                <p className="text-xs text-slate-500 mt-1">{seoDescription.length}/300 символов</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveSeo}>
                  <Icon name="Check" className="mr-2" size={16} />
                  Сохранить
                </Button>
                <Button variant="outline" onClick={handleCancelSeo}>
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-slate-500 font-medium">Заголовок:</p>
                <p className="text-slate-800">{seoTitle}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Описание:</p>
                <p className="text-slate-600">{seoDescription}</p>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${showDocuments ? 'bg-green-100' : 'bg-slate-200'}`}>
              <Icon name="FileText" className={showDocuments ? 'text-green-600' : 'text-slate-400'} size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Документы и сертификаты</p>
              <p className="text-sm text-slate-500">
                {showDocuments ? 'Секция отображается на сайте' : 'Секция скрыта от посетителей'}
              </p>
            </div>
          </div>
          <Button
            variant={showDocuments ? 'outline' : 'default'}
            onClick={onToggleDocuments}
          >
            {showDocuments ? (
              <>
                <Icon name="EyeOff" className="mr-2" size={16} />
                Скрыть секцию
              </>
            ) : (
              <>
                <Icon name="Eye" className="mr-2" size={16} />
                Показать секцию
              </>
            )}
          </Button>
        </Card>
      </div>
    </Card>
  );
}