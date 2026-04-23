import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import UtmBuilder from './UtmBuilder';

interface SiteSettingsSectionProps {
  showDocuments: boolean;
  onToggleDocuments: () => void;
}

export default function SiteSettingsSection({ 
  showDocuments, 
  onToggleDocuments 
}: SiteSettingsSectionProps) {
  const { settings, reload } = useSiteSettings();

  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [isEditingSeo, setIsEditingSeo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncCopied, setSyncCopied] = useState(false);

  useEffect(() => {
    setSeoTitle(settings.seoTitle);
    setSeoDescription(settings.seoDescription);
    setSeoKeywords(settings.seoKeywords);
    setFaviconUrl(settings.faviconUrl);
  }, [settings]);

  const updateMetaTags = (title: string, description: string, keywords: string) => {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;
    
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

    const ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
    if (ogImage) {
      ogImage.content = url;
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement;
    if (twitterImage) {
      twitterImage.content = url;
    }
  };

  const handleSaveSeo = async () => {
    try {
      const settingsToSave = [
        { key: 'seo_title', value: seoTitle },
        { key: 'seo_description', value: seoDescription },
        { key: 'seo_keywords', value: seoKeywords }
      ];

      for (const setting of settingsToSave) {
        const response = await fetch('https://functions.poehali.dev/1e3f4ec9-f868-4469-a847-6eb53c784111', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(setting)
        });

        if (!response.ok) {
          throw new Error(`Failed to save ${setting.key}`);
        }
      }

      localStorage.setItem('seo_title', seoTitle);
      localStorage.setItem('seo_description', seoDescription);
      localStorage.setItem('seo_keywords', seoKeywords);
      updateMetaTags(seoTitle, seoDescription, seoKeywords);
      
      window.dispatchEvent(new CustomEvent('seoUpdate'));
      reload();
      
      try {
        const notifyResponse = await fetch('https://functions.poehali.dev/1e3f4ec9-f868-4469-a847-6eb53c784111', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action: 'notify_search_engines' })
        });
        
        if (notifyResponse.ok) {
          const notifyData = await notifyResponse.json();
          console.log('Search engines notified:', notifyData);
        }
      } catch (notifyError) {
        console.warn('Failed to notify search engines:', notifyError);
      }
      
      setIsEditingSeo(false);
      alert('SEO настройки успешно сохранены в базу данных!\n\nПоисковые системы уведомлены об обновлении.\nИзменения применятся для всех посетителей сайта.');
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      alert('Ошибка при сохранении SEO настроек. Попробуйте еще раз.');
    }
  };

  const handleCancelSeo = () => {
    setSeoTitle(settings.seoTitle);
    setSeoDescription(settings.seoDescription);
    setSeoKeywords(settings.seoKeywords);
    setFaviconUrl(settings.faviconUrl);
    setIsEditingSeo(false);
  };

  const getSyncSnippet = () => {
    return `    <title>${seoTitle}</title>
    <meta name="description" content="${seoDescription}">
    <meta name="keywords" content="${seoKeywords}">
    <meta property="og:title" content="${seoTitle}">
    <meta property="og:description" content="${seoDescription}">
    <meta name="twitter:title" content="${seoTitle}">
    <meta name="twitter:description" content="${seoDescription}">`;
  };

  const handleCopySync = () => {
    navigator.clipboard.writeText(getSyncSnippet());
    setSyncCopied(true);
    setTimeout(() => setSyncCopied(false), 3000);
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
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1];
        
        const response = await fetch('https://functions.poehali.dev/1e3f4ec9-f868-4469-a847-6eb53c784111', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': localStorage.getItem('admin_token') || ''
          },
          body: JSON.stringify({
            faviconContent: base64Content,
            faviconFileName: file.name
          })
        });

        if (response.ok) {
          const data = await response.json();
          setFaviconUrl(data.favicon_url);
          updateFavicon(data.favicon_url);
          window.dispatchEvent(new Event('faviconUpdate'));
          reload();
          alert('Фавикон и OG-изображение успешно загружены!\n\n⚠️ Важно: Чтобы изменения отобразились в Telegram и соцсетях, нажмите "Опубликовать" в редакторе poehali.dev');
        } else {
          throw new Error('Ошибка загрузки на сервер');
        }
        
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSyncModal(true)}>
                <Icon name="RefreshCw" className="mr-2" size={16} />
                Синхронизировать с Google
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditingSeo(true)}>
                <Icon name="Edit" className="mr-2" size={16} />
                Редактировать
              </Button>
            </div>
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
              <Label htmlFor="seoKeywords">Ключевые слова</Label>
              <Textarea
                id="seoKeywords"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="СООУ, СРООУ, безопасность бассейна..."
                className="mt-2"
                rows={3}
              />
              <p className="text-xs text-slate-500 mt-1">{seoKeywords.length} символов</p>
            </div>

            <div>
              <Label htmlFor="faviconUpload">Фавикон и OG-изображение (JPG или PNG, до 5 МБ)</Label>
              <p className="text-xs text-slate-500 mt-1 mb-2">Это изображение будет использоваться как фавикон сайта и для превью в Telegram/соцсетях</p>
              <div className="mt-2">
                <Input
                  id="faviconUpload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFaviconUpload}
                  disabled={isUploadingFavicon}
                  className="mt-1"
                />
              </div>
              
              {faviconUrl && (
                <div className="mt-2 p-3 bg-slate-100 rounded-lg flex items-center justify-center">
                  <img src={faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                </div>
              )}
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
              <p className="text-slate-500 font-medium">Ключевые слова:</p>
              <p className="text-slate-600 text-xs">{seoKeywords.substring(0, 200)}{seoKeywords.length > 200 ? '...' : ''}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Фавикон:</p>
              <div className="flex items-center gap-2 mt-1">
                <img src={faviconUrl} alt="Favicon" className="w-6 h-6 object-contain" />
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
              {showDocuments ? 'Раздел виден посетителям' : 'Раздел скрыт от посетителей'}
            </p>
          </div>
        </div>
        <Button
          variant={showDocuments ? 'outline' : 'default'}
          size="sm"
          onClick={onToggleDocuments}
        >
          <Icon name={showDocuments ? 'EyeOff' : 'Eye'} className="mr-2" size={16} />
          {showDocuments ? 'Скрыть' : 'Показать'}
        </Button>
      </Card>

      <UtmBuilder />

      <Dialog open={showSyncModal} onOpenChange={setShowSyncModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Синхронизировать с Google Search Console</DialogTitle>
            <DialogDescription>
              Скопируйте и вставьте эти мета-теги в ваш index.html для индексации поисковиками.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                {getSyncSnippet()}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopySync} className="flex-1">
                <Icon name={syncCopied ? 'Check' : 'Copy'} className="mr-2" size={16} />
                {syncCopied ? 'Скопировано!' : 'Скопировать'}
              </Button>
              <Button variant="outline" onClick={() => setShowSyncModal(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}