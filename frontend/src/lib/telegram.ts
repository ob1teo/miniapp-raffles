import { WebApp } from "@twa-dev/types";

export function getTelegramUser() {
  const tg = window.Telegram as { WebApp: WebApp };
  return tg?.WebApp?.initDataUnsafe?.user;
}
