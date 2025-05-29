export interface ITelegramUser {
  id: number;
  telegramId?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  language_code?: string;
  ticketBalance?: number;
}

export interface IRaffle {
  id: number;
  prizeDescription: string;
  endsAt: string;
  totalTickets: number;
  participants: number;
  isFinished: boolean;
  userTickets: number;
  title: string;
  imageUrl: string;
}

export interface TelegramAuthRequest {
  initData: string;
}

export interface JoinRaffleRequest {
  raffleId: number;
  telegramId: string;
  tickets: number;
}

export interface JoinRaffleResponse {
  success: boolean;
  message?: string;
  updatedTicketBalance?: number;
}

export interface GetRafflesResponse {
  raffles: IRaffle[];
}

export interface ApiError {
  error: string;
}

export type ApiResponse<T> = T | ApiError;
