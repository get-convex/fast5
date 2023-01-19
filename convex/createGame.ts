import { DatabaseWriter, mutation } from './_generated/server';
import { defaultGame, randomGameName, withUser } from './common';
import { Document } from './_generated/dataModel';

export default mutation(
  withUser(async ({ db, user }): Promise<string | null> => {
    return createGameHelper(db, user, false);
  })
);

export const createGameHelper = async (
  db: DatabaseWriter,
  user: Document<'users'>,
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
