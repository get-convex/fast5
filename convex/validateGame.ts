import { z } from 'zod';
import { secureQuery } from './common';

export default secureQuery(
  [z.string()],
  async ({ db, user }, gameName): Promise<string | null> => {
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
);
