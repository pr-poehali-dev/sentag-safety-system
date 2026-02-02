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
  const [faviconUrl, setFaviconUrl] = useState('');
  const [isEditingSeo, setIsEditingSeo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  useEffect(() => {
    const savedTitle = localStorage.getItem('seo_title') || 'Безопасность вашего бассейна под контролем';
    const savedDescription = localStorage.getItem('seo_description') || 'Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания. Ее внедрение будет актуально в бассейнах, аквапарках и на других объектах, где есть закрытая вода.';
    const savedFavicon = localStorage.getItem('favicon_url') || 'https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/de3e8201-e38d-47fd-aeee-269c5979fdeb.jpg';
    setSeoTitle(savedTitle);
    setSeoDescription(savedDescription);
    setFaviconUrl(savedFavicon);
    
    updateMetaTags(savedTitle, savedDescription);
    updateFavicon(savedFavicon);
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

  const updateFavicon = (url: string) => {
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/x-icon';
      document.head.appendChild(favicon);
    }
    favicon.href = url;
  };

  const handleSaveSeo = () => {
    localStorage.setItem('seo_title', seoTitle);
    localStorage.setItem('seo_description', seoDescription);
    localStorage.setItem('favicon_url', faviconUrl);
    updateMetaTags(seoTitle, seoDescription);
    updateFavicon(faviconUrl);
    setIsEditingSeo(false);
    alert('SEO настройки сохранены');
  };

  const handleCancelSeo = () => {
    const savedTitle = localStorage.getItem('seo_title') || 'Безопасность вашего бассейна под контролем';
    const savedDescription = localStorage.getItem('seo_description') || 'Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания. Ее внедрение будет актуально в бассейнах, аквапарках и на других объектах, где есть закрытая вода.';
    const savedFavicon = localStorage.getItem('favicon_url') || 'https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/de3e8201-e38d-47fd-aeee-269c5979fdeb.jpg';
    setSeoTitle(savedTitle);
    setSeoDescription(savedDescription);
    setFaviconUrl(savedFavicon);
    setIsEditingSeo(false);
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Пожалуйста, выберите файл JPG или PNG');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5 МБ');
      return;
    }

    setIsUploadingFavicon(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFaviconUrl(base64String);
        setIsUploadingFavicon(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Ошибка загрузки фавикона:', error);
      alert('Не удалось загрузить файл');
      setIsUploadingFavicon(false);
    }

    e.target.value = '';
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

              <div>
                <Label>Фавикон</Label>
                <div className="mt-2 space-y-3">
                  <input
                    type="file"
                    id="faviconUpload"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFaviconUpload}
                    className="hidden"
                    disabled={isUploadingFavicon}
                  />
                  <label
                    htmlFor="faviconUpload"
                    className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-primary transition cursor-pointer block"
                  >
                    <Icon name="Upload" className="mx-auto mb-2 text-slate-400" size={24} />
                    <p className="text-sm text-slate-600">
                      {isUploadingFavicon ? 'Загрузка...' : 'Нажмите для загрузки фавикона'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">JPG или PNG до 5 МБ</p>
                  </label>
                  
                  <div className="text-center text-xs text-slate-500">или</div>
                  
                  <div>
                    <Label htmlFor="faviconUrl" className="text-xs">Вставить URL изображения</Label>
                    <Input
                      id="faviconUrl"
                      value={faviconUrl}
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      placeholder="https://cdn.poehali.dev/..."
                      className="mt-1"
                    />
                  </div>
                  
                  {faviconUrl && (
                    <div className="mt-2 p-3 bg-slate-100 rounded-lg flex items-center gap-3">
                      <img src={faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                      <span className="text-xs text-slate-600">Предпросмотр текущего фавикона</span>
                    </div>
                  )}
                </div>
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
              <div>
                <p className="text-slate-500 font-medium">Фавикон:</p>
                <div className="flex items-center gap-2 mt-1">
                  <img src={faviconUrl} alt="Favicon" className="w-6 h-6" />
                  <p className="text-slate-600 text-xs break-all">{faviconUrl}</p>
                </div>
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