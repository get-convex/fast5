import { defineSchema, defineTable } from 'convex/schema';
import { v } from 'convex/values';

export default defineSchema({
  games: defineTable({
    abandoned: v.boolean(),
    currentRound: v.number(),
    name: v.string(),
    public: v.boolean(),
    ready: v.boolean(),
    rounds: v.array(v.id('rounds')),
    score1: v.number(),
    score2: v.number(),
    user1: v.id('users'),
    user1Ping: v.number(),
    user2: v.union(v.id('users'), v.null()),
    user2Ping: v.union(v.number(), v.null()),
    winner: v.number(),
  }),
  rounds: defineTable({
    overflow: v.boolean(),
    user1: v.object({ guesses: v.array(v.string()), spying: v.boolean() }),
    user2: v.object({ guesses: v.array(v.string()), spying: v.boolean() }),
    winner: v.union(v.null(), v.number()),
    word: v.string(),
  }),
  users: defineTable({
    displayName: v.string(),
    losses: v.number(),
    name: v.string(),
    photoUrl: v.string(),
    ties: v.number(),
    tokenIdentifier: v.string(),
    wins: v.number(),
  }).index('by_token', ['tokenIdentifier']),
});
