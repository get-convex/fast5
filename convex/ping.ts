import { v } from 'convex/values';
import { withUser } from './lib/withUser';
import { mutation } from './_generated/server';

export default mutation({
  args: { gameId: v.id('games') },
  handler: withUser(async ({ db, user }, { gameId }) => {
    const game = await db.get(gameId);
    if (!game) throw Error('Game not found');

    const now = Math.floor(Date.now() / 1000);

    if (game.user1.equals(user._id)) {
      game.user1Ping = now;
    } else if (game.user2 !== undefined && game.user2?.equals(user._id)) {
      game.user2Ping = now;
    }
    await db.patch(game._id, game);
  }),
});
