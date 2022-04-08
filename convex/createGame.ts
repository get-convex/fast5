import { Id, mutation } from '@convex-dev/server';
import { getUser, randomGameName } from './common';

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
  const game = {
    name: gameName,
    public: false,
    ready: false,
    user1: user._id,
    score1: 0,
    score2: 0,
    currentRound: -1,
    rounds: [],
  };
  await db.insert('games', game);
  return gameName;
});
