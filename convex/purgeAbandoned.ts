import { mutation } from 'convex-dev/server';
import { Id } from 'convex-dev/values';
import { abandonGame, getUser, recordGameStats } from './common';

const TIMEOUT_THRESHOLD = 60; // Gone for one minute = abandoned.

export default mutation(async ({ db }) => {
  const now = Math.floor(Date.now() / 1000);
  let games = await db
    .table('games')
    .filter((q) =>
      q.and(q.eq(q.field('abandoned'), false), q.eq(q.field('winner'), 0))
    )
    .collect();

  for (const game of games) {
    if (
      now - game.user1Ping > TIMEOUT_THRESHOLD ||
      now - (game.user2Ping ?? now) > TIMEOUT_THRESHOLD
    ) {
      console.log(`Abandoning game ${game.name}`);
      abandonGame(game);
      await recordGameStats(db, game);
      await db.update(game._id, game);
    }
  }
});
