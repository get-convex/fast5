import { WORDS } from '../lib/game/constants';
import { Document, Id } from './_generated/dataModel';
import { mutationWithUser } from './lib/withUser';
import { z } from 'zod';
import withZodArgs from './lib/withZod';
import { MutationCtx } from './_generated/server';

export const secureMutation = <
  Args extends [z.ZodTypeAny, ...z.ZodTypeAny[]] | [],
  Returns extends z.ZodTypeAny
>(
  zodArgs: Args,
  func: (
    ctx: MutationCtx & { user: Document<'users'> },
    ...args: z.output<z.ZodTuple<Args>>
  ) => z.input<z.ZodPromise<Returns>>,
  zodReturn?: Returns
) => mutationWithUser(withZodArgs(zodArgs, func, zodReturn));

export default secureMutation(
  [
    z.custom<Id<'games'>>(
      (val) => val instanceof Id && val.tableName === 'games'
    ),
    z.number(),
  ],
  async ({ db, user }, gameId, next) => {
    console.log({ gameId, next });
    var game = await db.get(gameId);
    if (!game) throw Error('Game not found');
    if (!user._id.equals(game.user1) && !user._id.equals(game.user2)) {
      throw Error("User trying to start someone else's round");
    }
    if (!game.ready) {
      // Still waiting on the other party.
      return;
    }
    if (game.rounds.length === 5) {
      // Game is over.
      return;
    }
    if (game.rounds.length !== next) {
      // Lost the race to create the round.
      return;
    }
    if (game.rounds.length > 0) {
      const lastId = game.rounds[game.rounds.length - 1];
      const lastRound = (await db.get(lastId))!;
      if (typeof lastRound.winner !== 'number') {
        // Last round, no one won yet!
        return;
      }
    }
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const round = {
      word: word,
      user1: {
        guesses: [],
        spying: false,
      },
      user2: {
        guesses: [],
        spying: false,
      },
      winner: null,
      overflow: false,
    };
    const id = await db.insert('rounds', round);
    game.rounds.push(id);
    game.currentRound = game.rounds.length - 1;
    await db.patch(game._id, game);
  }
);
