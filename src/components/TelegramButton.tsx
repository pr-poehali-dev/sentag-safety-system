const TelegramButton = () => {
  return (
    <a
      href="http://t.me/sentag_bot"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 shadow-xl hover:shadow-2xl transition-all duration-300 animate-call-attention hover:animate-none"
      aria-label="Связаться через Telegram"
      style={{
        filter: 'drop-shadow(0 0 0 4px white) drop-shadow(0 0 8px rgba(0,0,0,0.2))'
      }}
    >
      <img 
        src="https://cdn.poehali.dev/projects/375d2671-595f-4267-b13e-3a5fb218b045/bucket/34ea2ec2-d41f-4c6d-a02a-c4c43c29ef6c.png"
        alt="Telegram"
        className="w-16 h-16"
      />
    </a>
  );
};

export default TelegramButton;