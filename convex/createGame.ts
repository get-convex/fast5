import { mutation } from 'convex-dev/server';
import { Id } from 'convex-dev/values';
import { defaultGame, getUser, randomGameName } from './common';

export default mutation(async ({ db, auth }): Promise<string | null> => {
  const user = await getUser(db, auth);

  while (true) {
    var gameName = randomGameName();

    var existing = await db
      .table('games')
      .filter((q) => q.eq(q.field('name'), gameName))
      .first();

    if (existing === null) {
      // We're creating the game!
      break;
    }
  }
  const game = defaultGame(gameName, user, false);
  await db.insert('games', game);
  return gameName;
});
