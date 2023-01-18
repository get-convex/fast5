import { DatabaseWriter, mutation } from './_generated/server';
import { defaultGame, getUser, randomGameName } from './common';
import { User } from '../lib/game/proto';

export default mutation(async ({ db, auth }): Promise<string | null> => {
  const user = await getUser(db, auth);

  return createGameHelper(db, user, false);
});

export const createGameHelper = async (
  db: DatabaseWriter,
  user: User,
  pub: boolean
) => {
  while (true) {
    var gameName = randomGameName();

    var existing = await db
      .query('games')
      .filter((q) => q.eq(q.field('name'), gameName))
      .unique();

    if (existing === null) {
      // We're creating the game!
      break;
    }
  }
  const game = defaultGame(gameName, user, pub);
  await db.insert('games', game);
  return gameName;
};
