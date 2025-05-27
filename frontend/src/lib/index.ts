export interface IRaffle {
  id: string;
  title: string;
  imageUrl: string;
  endsAt: string;
  prize: string;
  totalTickets: number;
  participantCount: number;
  userTickets: number;
}

export interface IRaffleStats {
  raffleId: string;
  title: string;
  endsAt: string;
  totalTickets: number;
  userTickets: number;
  participantCount: number;
}

export interface IUser {
  id: string;
  attemptsLeft: number;
}

export interface JoinRaffleRequest {
  raffleId: string;
  userId: string;
  tickets: number;
}

export interface JoinRaffleResponse {
  success: boolean;
  newAttempts: number;
}

export interface ApiError {
  error: string;
}

export type ApiResponse<T> = T | ApiError;
