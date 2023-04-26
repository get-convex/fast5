export interface UserStats {
  wins: number;
  losses: number;
  ties: number;
}

type GameUser = {
  displayName: string;
  photoUrl: string;
  score: number;
  isYou: boolean;
  stats: UserStats;
};

export interface BackendGame {
  round: number;
  user1: GameUser;
  user2: GameUser;
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
