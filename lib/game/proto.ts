export interface BackendGame {
  round: number;
  user1: {
    displayName: string;
    score: number;
  };
  user2: {
    displayName: string;
    score: number;
  };
  ready: boolean;
  inRound: boolean;
  winner: number;
  over: boolean;
}

export interface BackendRound {
  word: null | string;
  user1: {
    guesses: string[][];
    scores: number[];
    stolen: boolean;
  };
  user2: {
    guesses: string[][];
    scores: number[];
    stolen: boolean;
  };
  winner: number | null;
  overflow: boolean;
}
