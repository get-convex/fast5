import { query } from '@convex-dev/server';
import { getUser } from './common';

export default query(
  async ({ db, auth }, gameName: string): Promise<string | null> => {
    const user = await getUser(db, auth);
    var gameName = gameName.toLocaleLowerCase().trim();

    var game = await db
      .table('games')
      .filter((q) => q.eq(q.field('name'), gameName))
      .first();

    if (game === null) {
      return 'No such game';
    }

    // Already in the game, or game is available to join.
    if (
      (user._id.equals(game.user1) ||
        user._id.equals(game.user2) ||
        game.user2) ??
      true
    ) {
      return null;
    }
    return 'Game already has two players';
  }
);
