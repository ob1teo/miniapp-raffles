import {
  IRaffle,
  JoinRaffleRequest,
  JoinRaffleResponse,
  ApiError,
  ApiResponse,
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

      const json = await resp.json();

      if (!resp.ok) {
        return { error: json?.error || "Unknown error" };
      }

      return json;
    } catch (err) {
      console.error(`Error with request ${err}`);
      return { error: "Network error" };
    }
  }

  export async function getRaffles(): Promise<IRaffle[]> {
    const res = await fetchApi<IRaffle[]>({
      method: "GET",
      route: "raffles",
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
    input: JoinRaffleRequest,
  ): Promise<JoinRaffleResponse | ApiError> {
    const res = await fetchApi<JoinRaffleResponse>({
      method: "POST",
      route: `raffles/${input.raffleId}/join`,
      headers: {
        "Content-Type": "application/json",
        "x-user-id": input.userId,
      },
      body: input,
    });

    return res;
  }
}
