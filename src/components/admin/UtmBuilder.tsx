import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const BASE_URL = 'https://sentag.ru';

const PRESETS = [
  { label: 'Яндекс.Директ', source: 'yandex', medium: 'cpc', campaign: 'direct' },
  { label: 'Google Ads', source: 'google', medium: 'cpc', campaign: 'search' },
  { label: 'ВКонтакте', source: 'vk', medium: 'social', campaign: 'vk_ads' },
  { label: 'Telegram', source: 'telegram', medium: 'social', campaign: 'tg_channel' },
  { label: '2ГИС', source: '2gis', medium: 'referral', campaign: '2gis_profile' },
  { label: 'Email-рассылка', source: 'email', medium: 'email', campaign: 'newsletter' },
];

export default function UtmBuilder() {
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [copied, setCopied] = useState(false);

  const buildUrl = () => {
    const params = new URLSearchParams();
    if (source.trim()) params.set('utm_source', source.trim());
    if (medium.trim()) params.set('utm_medium', medium.trim());
    if (campaign.trim()) params.set('utm_campaign', campaign.trim());
    const qs = params.toString();
    return qs ? `${BASE_URL}/?${qs}` : BASE_URL;
  };

  const url = buildUrl();
  const isReady = source.trim().length > 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setSource(p.source);
    setMedium(p.medium);
    setCampaign(p.campaign);
  };

  return (
    <Card className="p-4 bg-slate-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
          <Icon name="Link" className="text-violet-600" size={20} />
        </div>
        <div>
          <p className="font-semibold text-slate-800">UTM-ссылки для рекламы</p>
          <p className="text-sm text-slate-500">Генератор отслеживаемых ссылок</p>
        </div>
      </div>

      {/* Быстрые пресеты */}
      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-2 font-medium">Быстрый выбор:</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                source === p.source && medium === p.medium
                  ? 'bg-violet-100 border-violet-300 text-violet-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div>
          <Label className="text-xs text-slate-600">utm_source <span className="text-red-500">*</span></Label>
          <Input
            className="mt-1"
            placeholder="yandex, google, vk…"
            value={source}
            onChange={e => setSource(e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1">Откуда трафик</p>
        </div>
        <div>
          <Label className="text-xs text-slate-600">utm_medium</Label>
          <Input
            className="mt-1"
            placeholder="cpc, social, email…"
            value={medium}
            onChange={e => setMedium(e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1">Тип трафика</p>
        </div>
        <div>
          <Label className="text-xs text-slate-600">utm_campaign</Label>
          <Input
            className="mt-1"
            placeholder="название кампании"
            value={campaign}
            onChange={e => setCampaign(e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1">Название кампании</p>
        </div>
      </div>

      {/* Результат */}
      <div className={`rounded-lg border p-3 transition ${isReady ? 'bg-white border-violet-200' : 'bg-slate-100 border-slate-200'}`}>
        <p className="text-xs text-slate-400 mb-1">Готовая ссылка:</p>
        <p className={`text-sm break-all font-mono ${isReady ? 'text-slate-800' : 'text-slate-400'}`}>
          {url}
        </p>
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          onClick={handleCopy}
          disabled={!isReady}
          className="gap-2"
          size="sm"
        >
          <Icon name={copied ? 'Check' : 'Copy'} size={15} />
          {copied ? 'Скопировано!' : 'Скопировать ссылку'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setSource(''); setMedium(''); setCampaign(''); }}
          disabled={!source && !medium && !campaign}
        >
          Сбросить
        </Button>
      </div>
    </Card>
  );
}
