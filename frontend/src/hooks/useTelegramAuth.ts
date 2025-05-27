import { useEffect, useState } from "react";
import { Api } from "@/lib/api";
import type { WebApp, WebAppInitData } from "@twa-dev/types";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

// eslint-disable-next-line
interface User extends TelegramUser {}

export function useTelegramAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tg: WebApp | undefined = window.Telegram?.WebApp;
    console.log(window.Telegram?.WebApp?.initDataUnsafe);

    async function authorizeWithTelegram(data: WebAppInitData) {
      try {
        const res = await Api.fetchApi<User>({
          method: "POST",
          route: "telegram/auth",
          body: data,
          headers: { "Content-Type": "application/json" },
        });

        if ("error" in res) {
          throw new Error(res.error);
        }

        setUser(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }

    if (tg && tg.initDataUnsafe && Object.keys(tg.initDataUnsafe).length > 0) {
      tg.ready?.();
      authorizeWithTelegram(tg.initDataUnsafe);
    } else {
      setUser({
        id: 123456,
        first_name: "test",
        last_name: "user",
        username: "loooool",
        photo_url: "",
      });
      setLoading(false);
      console.warn("telegram webapp not initialize");
    }
  }, []);

  return { user, loading, error };
}
