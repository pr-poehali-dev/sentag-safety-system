import Icon from '@/components/ui/icon';

const TelegramButton = () => {
  return (
    <a
      href="http://t.me/sentag_bot"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#0088cc] hover:bg-[#006699] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 animate-call-attention hover:animate-none ring-4 ring-white"
      aria-label="Связаться через Telegram"
    >
      <Icon name="Send" size={28} />
    </a>
  );
};

export default TelegramButton;