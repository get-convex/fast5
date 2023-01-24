import { defineSchema, defineTable, s } from 'convex/schema';

export default defineSchema(
  {
    games: defineTable({
      abandoned: s.boolean(),
      currentRound: s.number(),
      name: s.string(),
      public: s.boolean(),
      ready: s.boolean(),
      rounds: s.array(s.id('rounds')),
      score1: s.number(),
      score2: s.number(),
      user1: s.id('users'),
      user1Ping: s.number(),
      user2: s.union(s.id('users'), s.null()),
      user2Ping: s.union(s.number(), s.null()),
      winner: s.number(),
    }),
    rounds: defineTable({
      overflow: s.boolean(),
      user1: s.object({ guesses: s.array(s.string()), spying: s.boolean() }),
      user2: s.object({ guesses: s.array(s.string()), spying: s.boolean() }),
      winner: s.union(s.null(), s.number()),
      word: s.string(),
    }),
    users: defineTable({
      displayName: s.string(),
      losses: s.number(),
      name: s.string(),
      photoUrl: s.string(),
      ties: s.number(),
      tokenIdentifier: s.string(),
      wins: s.number(),
    }).index('by_token', ['tokenIdentifier']),
  },
  { strict: false }
);
