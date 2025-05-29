import {
  IRaffle,
  ApiResponse,
  ITelegramUser,
  JoinRaffleRequest,
  JoinRaffleResponse,
} from "./index";

// eslint-disable-next-line
export namespace Api {
  export async function fetchApi<T>(opts: {
    method: string;
    route: string;
    // eslint-disable-next-line
    body?: any;
    // eslint-disable-next-line
    headers?: any;
  }): Promise<ApiResponse<T>> {
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${opts.route}`,
        {
          method: opts.method,
          headers: opts.headers,
          body: opts.body ? JSON.stringify(opts.body) : undefined,
        },
      );

      const data = await resp.json();

      if (!resp.ok) {
        return { error: data.error || "Unknown error" };
      }

      return data;
    } catch (err) {
      console.error(`Error with request ${err}`);
      return { error: "Network error" };
    }
  }

  export async function getRaffles(telegramId: string): Promise<IRaffle[]> {
    const res = await fetchApi<IRaffle[]>({
      method: "GET",
      route: `raffles/${telegramId}`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if ("error" in res) {
      console.error("Failed to load raffles:", res.error);
      return [];
    }

    return res;
  }

  export async function joinRaffle(
    body: JoinRaffleRequest,
  ): Promise<JoinRaffleResponse | { error: string }> {
    const res = await fetchApi<JoinRaffleResponse>({
      method: "POST",
      route: "raffles/join",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if ("error" in res) {
      return { error: res.error };
    }

    return res;
  }

  export async function createOrGetUser(body: {
    telegramId: string;
    username?: string;
  }): Promise<{ success: boolean; user?: ITelegramUser; error?: string }> {
    const res = await fetchApi<{
      success: boolean;
      user?: ITelegramUser;
      error?: string;
    }>({
      method: "POST",
      route: "telegram/auth",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if ("error" in res) {
      return { success: false, error: res.error };
    }

    return res;
  }
}
