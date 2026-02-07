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
  const [seoKeywords, setSeoKeywords] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [isEditingSeo, setIsEditingSeo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/4c5eb463-eeb0-41c1-89da-753f8043246e');
        if (response.ok) {
          const data = await response.json();
          const settings = data.settings || {};
          
          const defaultKeywords = 'СООУ, СРООУ, СОУ, УзСООУ, ВСООУ, ГОСТ Р 59219-2020, ГОСТ Р 58458-2020, бассейн гост, система оповещения опасности утопления, Ультразвуковая система оповещения опасности утопления, Видеосистема оповещения опасности утопления, система обнаружения утопающих, безопасность на воде, безопасность в бассейне, браслет безопасности, спасатели на воде, спасатели в бассейне, тонет, не утонуть, спасение на воде, утонул в бассейне, утонул в аквапарке, спасли в бассейне, захлебнулся в бассейне, не смогли спасти в аквапарке, система соответствует ГОСТ Р 59219-2020, сертифицированная СООУ, для бассейнов, для аквапарка, для безопасности на воде, для безопасности в воде, сентаг, сентаг аб, sentag ab, sentag, система утопленника, система тонущих, чтобы не утонуть, не захлебнуться, NFC метка на браслет, браслет ключ, браслетом открывать ящик';
          const defaultTitle = 'Безопасность вашего бассейна под контролем';
          const defaultDescription = 'Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания. Ее внедрение будет актуально в бассейнах, аквапарках и на других объектах, где есть закрытая вода.';
          
          const seoTitle = settings.seo_title || defaultTitle;
          const seoDescription = settings.seo_description || defaultDescription;
          const seoKeywords = settings.seo_keywords || defaultKeywords;
          const faviconFromSettings = settings.favicon_url || 'https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/de3e8201-e38d-47fd-aeee-269c5979fdeb.jpg';
          
          setSeoTitle(seoTitle);
          setSeoDescription(seoDescription);
          setSeoKeywords(seoKeywords);
          setFaviconUrl(faviconFromSettings);
          
          updateMetaTags(seoTitle, seoDescription, seoKeywords);
          updateFavicon(faviconFromSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

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

    // Также обновляем OG-изображение
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
        const response = await fetch('https://functions.poehali.dev/4c5eb463-eeb0-41c1-89da-753f8043246e', {
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
      
      setIsEditingSeo(false);
      alert('SEO настройки успешно сохранены в базу данных!\n\nИзменения применятся для всех посетителей сайта.');
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      alert('Ошибка при сохранении SEO настроек. Попробуйте еще раз.');
    }
  };

  const handleCancelSeo = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/4c5eb463-eeb0-41c1-89da-753f8043246e');
      if (response.ok) {
        const data = await response.json();
        const settings = data.settings || {};
        
        const defaultKeywords = 'СООУ, СРООУ, СОУ, УзСООУ, ВСООУ, ГОСТ Р 59219-2020, ГОСТ Р 58458-2020, бассейн гост, система оповещения опасности утопления, Ультразвуковая система оповещения опасности утопления, Видеосистема оповещения опасности утопления, система обнаружения утопающих, безопасность на воде, безопасность в бассейне, браслет безопасности, спасатели на воде, спасатели в бассейне, тонет, не утонуть, спасение на воде, утонул в бассейне, утонул в аквапарке, спасли в бассейне, захлебнулся в бассейне, не смогли спасти в аквапарке, система соответствует ГОСТ Р 59219-2020, сертифицированная СООУ, для бассейнов, для аквапарка, для безопасности на воде, для безопасности в воде, сентаг, сентаг аб, sentag ab, sentag, система утопленника, система тонущих, чтобы не утонуть, не захлебнуться, NFC метка на браслет, браслет ключ, браслетом открывать ящик';
        const savedTitle = localStorage.getItem('seo_title') || 'Безопасность вашего бассейна под контролем';
        const savedDescription = localStorage.getItem('seo_description') || 'Передовые системы защиты для посетителей бассейнов. Система оповещения опасности утопления производства компании «Sentag AB» − современное решение для обеспечения безопасности плавания. Ее внедрение будет актуально в бассейнах, аквапарках и на других объектах, где есть закрытая вода.';
        const savedKeywords = localStorage.getItem('seo_keywords') || defaultKeywords;
        const faviconFromSettings = settings.favicon_url || 'https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/de3e8201-e38d-47fd-aeee-269c5979fdeb.jpg';
        
        setSeoTitle(savedTitle);
        setSeoDescription(savedDescription);
        setSeoKeywords(savedKeywords);
        setFaviconUrl(faviconFromSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
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
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1];
        
        const response = await fetch('https://functions.poehali.dev/4c5eb463-eeb0-41c1-89da-753f8043246e', {
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
  );
}