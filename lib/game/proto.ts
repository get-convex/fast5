import { Id } from 'convex-dev/values';

export interface BackendGame {
  round: number;
  user1: {
    displayName: string;
    photoUrl: string;
    score: number;
    isYou: boolean;
  };
  user2: {
    displayName: string;
    photoUrl: string;
    score: number;
    isYou: boolean;
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
export interface User {
  _id: Id;
  name: string;
  displayName: string;
  photoUrl: string;
  tokenIdentifier: string;
}
