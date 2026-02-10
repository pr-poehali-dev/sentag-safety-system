import Icon from '@/components/ui/icon';

const TelegramButton = () => {
  return (
    <a
      href="http://t.me/sentag_bot"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#0088cc] hover:bg-[#006699] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Связаться через Telegram"
    >
      <Icon name="Send" size={24} />
    </a>
  );
};

export default TelegramButton;
