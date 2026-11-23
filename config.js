/**
 * НАСТРОЙКИ САЙТА «КОД МОНТАЖЁРА — ПРАКТИКУМ 2027»
 * -------------------------------------------------
 * Все юридические документы лежат прямо на сайте в папке `docs/`.
 */
window.SITE_CONFIG = {
  // Бесплатный серверный обработчик формы (Google Apps Script -> Telegram @montagecore_leads_bot)
  formEndpoint: 'https://script.google.com/macros/s/AKfycbxIlnw89fxvGOBGQPxOzoFDsZnDxo12BP1JVq6G5hPIWMhfScgfr9V7QxTcDmaS7gXMdw/exec',

  links: {
    // Контакты и переход после заявки
    telegram: 'https://t.me/montagecore',
    instagram: 'https://instagram.com/',

    // Юридические документы (прямые PDF прямо на вашем домене)
    offer: 'docs/publichnaya-oferta.pdf',          // Публичная оферта
    privacy: 'docs/politika-pdn.pdf',              // Политика обработки персональных данных
    marketingConsent: 'docs/soglasie-reklama.pdf', // Согласие на получение рекламной рассылки
    pdnConsent: 'docs/soglasie-pdn.pdf',           // Согласие на обработку персональных данных

    // Разработчик
    developer: 'https://t.me/s1marsa',
  },

  // Вертикальные видео для телефонов в блоке «THE CREATOR»
  creatorVideos: {
    trends: 'videos/trends.mp4',
    creative: 'videos/creative.mp4',
    money: 'videos/money.mp4',
  },
};
