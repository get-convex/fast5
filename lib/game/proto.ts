export interface BackendGame {
  round: number;
  user1: {
    displayName: string;
    photoUrl: string;
    score: number;
    isYou: boolean;
    stats: UserStats;
  };
  user2: {
    displayName: string;
    photoUrl: string;
    score: number;
    isYou: boolean;
    stats: UserStats;
  };
  public: boolean;
  ready: boolean;
  abandoned: boolean;
  inRound: boolean;
  winner: number;
  over: boolean;
}

export interface BackendRound {
  word: null | string;
  user1: {
    guesses: string[][];
    scores: number[];
    spying: boolean;
  };
  user2: {
    guesses: string[][];
    scores: number[];
    spying: boolean;
  };
  winner: number | null;
  overflow: boolean;
}

export interface UserStats {
  wins: number;
  losses: number;
  ties: number;
}
