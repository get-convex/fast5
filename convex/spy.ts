import { v } from 'convex/values';
import { withUser } from './lib/withUser';
import { mutation } from './_generated/server';

export default mutation({
  args: { gameId: v.id('games') },
  handler: withUser(async ({ db, user }, { gameId }) => {
    const game = await db.get(gameId);
    if (!game) throw Error('Game not found');
    if (game.currentRound < 0) {
      return;
    }
    let roundId = game.rounds[game.currentRound];
    const round = (await db.get(roundId))!;
    if (typeof round.winner === 'number') {
      return; // Round is over.
    }

    // Which user is this?
    if (user._id.equals(game.user1)) {
      var userRound = round.user1;
    } else if (user._id.equals(game.user2)) {
      var userRound = round.user2;
    } else {
      throw Error("Trying to spy on someone else's game?");
    }

    // Must be room for another guess, if the winner is not decided.
    userRound.spying = true;
    db.replace(round._id, round);
  }),
});
