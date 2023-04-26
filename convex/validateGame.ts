import { v } from 'convex/values';
import { query } from './_generated/server';
import { withUser } from './lib/withUser';

export default query({
  args: {
    gameName: v.string(),
  },
  handler: withUser(
    async ({ db, user }, { gameName }): Promise<string | null> => {
      var gameName = gameName.toLocaleLowerCase().trim();

      var game = await db
        .query('games')
        .filter((q) => q.eq(q.field('name'), gameName))
        .unique();

      if (game === null) {
        return 'No such game';
      }

      // Already in the game, or game is available to join.
      if (
        user._id.equals(game.user1) ||
        user._id.equals(game.user2) ||
        !game.user2
      ) {
        return null;
      }
      return 'Game already has two players';
    }
  ),
});
