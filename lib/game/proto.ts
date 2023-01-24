import { z } from 'zod';

const UserStatsZod = z.object({
  wins: z.number(),
  losses: z.number(),
  ties: z.number(),
});
export type UserStats = z.infer<typeof UserStatsZod>;

const GameUser = z.object({
  displayName: z.string(),
  photoUrl: z.string(),
  score: z.number(),
  isYou: z.boolean(),
  stats: UserStatsZod,
});

export const BackendGameZod = z.object({
  round: z.number(),
  user1: GameUser,
  user2: GameUser,
  public: z.boolean(),
  ready: z.boolean(),
  abandoned: z.boolean(),
  inRound: z.boolean(),
  winner: z.number(),
  over: z.boolean(),
});
export type BackendGame = z.infer<typeof BackendGameZod>;

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
