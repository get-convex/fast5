import { query } from 'convex-dev/server';
import { Id } from 'convex-dev/values';
import { User, UserStats } from '../lib/game/proto';
import { getUser } from './common';

export default query(
  async ({ db, auth }, gameId: Id): Promise<UserStats | null> => {
    const user = await getUser(db, auth);
    const game = await db.get(gameId);
    if (!game.done) {
      return null;
    }

    const user1 = await db.get(game.user1);
    const user2 = await db.get(game.user2);

    return {
      user1: {
        wins: user1.wins,
        losses: user1.losses,
        ties: user1.ties,
      },
      user2: {
        wins: user2.wins,
        losses: user2.losses,
        ties: user2.ties,
      },
    };
  }
);
