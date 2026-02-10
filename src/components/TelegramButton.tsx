const TelegramButton = () => {
  return (
    <a
      href="http://t.me/sentag_bot"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 animate-call-attention hover:animate-none ring-4 ring-white hover:ring-[#0088cc]"
      aria-label="Связаться через Telegram"
    >
      <img 
        src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/34ea2ec2-d41f-4c6d-a02a-c4c43c29ef6c.png"
        alt="Telegram"
        className="w-full h-full rounded-full"
      />
    </a>
  );
};

export default TelegramButton;